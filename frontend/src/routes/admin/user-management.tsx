import { Button, Row, Col } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import StatCard from '../../components/stat-card/stat-card';
import UserListItem from '../../components/user-list-item/user-list-item';
import { useEffect, useState } from 'react';
import type { UserDTO } from '../../dto/user-dto';
import { changeIsUserBanned, getAllUsers } from '../../service/user-service';
import Spinner from '../../components/spinner/spinner';
import ErrorCard from '../../components/error-card/error-card';
import { API_BASE_URL } from '../../service/api-config';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, LineChart, CartesianGrid, XAxis, YAxis, Line } from 'recharts';
import './user-management.css';

const base_url = API_BASE_URL;

export function meta() {
    return [
        { title: "Gestión de Usuarios | OptiTour" },
    ];
}

export default function UserManagement() {
    const navigate = useNavigate();

    const [users, setUsers] = useState<UserDTO[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    async function handleGetAllUsers() {
        setIsLoading(true);
        setError(null);

        try {
            const response = await getAllUsers();
            setUsers(response);
        }
        catch (err) {
            err instanceof Error
                ? setError(err.message)
                : setError("Se ha producido un error al cargar los datos de los usuarios.");
        }
        finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        handleGetAllUsers();
    }, []);

    const [banningUserId, setBanningUserId] = useState<number | null>(null);
    const [banError, setBanError] = useState<string | null>(null);

    async function handleBanButton(id: number, banned: boolean) {
        setBanningUserId(id);
        setBanError(null);
        try {
            const response = await changeIsUserBanned(id);
            setUsers(users.map(u => u.id === id ? response : u));
        }
        catch (err) {
            if (err instanceof Error)
                setBanError(err.message);
            else
                banned
                    ? setBanError("Se ha producido un error al desbloquear el usuario")
                    : setBanError("Se ha producido un error al bloquear el usuario");
        }
        finally {
            setBanningUserId(null);
        }
    }

    const pieChartData = [
        { name: "Activos", value: users.filter(u => !u.isBanned).length },
        { name: "Bloqueados", value: users.filter(u => u.isBanned).length }
    ];

    const COLORS = ['#26D12A', '#dc3545'];

    const evolutionData = users
        // Filters elements with no createdAt field
        .filter(u => u.createdAt)
        // Order from old to recent
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        // Group by month
        .reduce((acc, user) => {
            const date = new Date(user.createdAt);
            const month = date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
            const period = month.charAt(0).toUpperCase() + month.slice(1);

            const existing = acc.find(item => item.period === period);
            if (existing)
                existing.new += 1;
            else
                acc.push({ period, new: 1, total: 0 });

            return acc;
        }, [] as { period: string; new: number; total: number }[])
        // Calculate total accumulate
        .map((item, index, arr) => {
            item.total = arr.slice(0, index + 1).reduce((sum, current) => sum + current.new, 0);
            return item;
        });

    return (
        <>
            {isLoading ? (
                <Spinner />
            ) : error ? (
                <ErrorCard text={error} />
            ) : (
                <div>
                    <div className="ot-panel-header">
                        <h1 className="ot-panel-title">Gestión de usuarios</h1>

                        <Button onClick={() => navigate('/admin/create')} className="ot-panel-action ot-panel-action--inline">
                            Crear nueva cuenta de administración
                        </Button>
                    </div>

                    <h2 className="ot-panel-subtitle">Información general</h2>

                    <Row className="g-3 mb-3">
                        <Col md={4}>
                            <StatCard value={String(users.length)} label="Usuarios totales" className="ot-stat-card--users" />
                        </Col>
                        <Col md={8}>
                            <div className="ot-chart-card">
                                <h3 className="ot-chart-title">Estado de los usuarios</h3>
                                <ResponsiveContainer width="100%" height={220}>
                                    <PieChart>
                                        <Pie
                                            data={pieChartData}
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={75}
                                            label
                                        >
                                            {pieChartData.map((_, index) => (
                                                <Cell key={index} fill={COLORS[index]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </Col>
                    </Row>

                    <div className="ot-chart-card mb-4">
                        <h3 className="ot-chart-title">Evolución de usuarios registrados</h3>
                        <ResponsiveContainer width="100%" height={260}>
                            <LineChart data={evolutionData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E4E7E4" />
                                <XAxis dataKey="period" stroke="#6B7280" />
                                <YAxis allowDecimals={false} stroke="#6B7280" />
                                <Tooltip />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="total"
                                    name="Usuarios acumulados"
                                    stroke="#26D12A"
                                    strokeWidth={3}
                                    dot={{ r: 4 }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    <h2 className="ot-panel-subtitle">Lista de usuarios registrados</h2>
                    {banError && <ErrorCard text={banError} />}
                    {users.map((user) => (
                        <UserListItem
                            key={user.id}
                            userName={user.userName}
                            avatarSrc={`${base_url}/user/${user.id}/image`}
                            actions={
                                <>
                                    <Button
                                        ref={(el: HTMLButtonElement | null) => {
                                            if (el) {
                                                el.onclick = () => handleBanButton(user.id, user.isBanned);
                                            }
                                        }}
                                        variant={user.isBanned ? 'outline-success' : 'outline-danger'}
                                        disabled={banningUserId === user.id || user.roles.includes("ADMIN")}
                                        title={user.roles.includes("ADMIN") ? "No se puede bloquear la cuenta de un administrador" : undefined}
                                    >
                                        {banningUserId === user.id ? (
                                            <>
                                                <span
                                                    className="spinner-border spinner-border-sm me-2"
                                                    role="status"
                                                    aria-hidden="true"
                                                />
                                                {user.isBanned ? 'Desbloqueando...' : 'Bloqueando...'}
                                            </>
                                        ) : (
                                            user.isBanned ? 'Desbloquear' : 'Bloquear'
                                        )}
                                    </Button>
                                    <Link to={`/admin/users/${user.id}`} className="btn btn-outline-dark">
                                        Ver perfil
                                    </Link>
                                </>
                            }
                        />
                    ))}
                </div>
            )}
        </>
    );
}