import { Button, Row, Col } from 'react-bootstrap';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import StatCard from '../../../components/stat-card/stat-card';
import UserListItem from '../../../components/user-list-item/user-list-item';
import { useEffect, useState } from 'react';
import type { UserDTO } from '../../../dto/user-dto';
import { changeIsUserBanned, getAllCreationDates, getPagedUsers } from '../../../service/user-service';
import ErrorCard from '../../../components/error-card/error-card';
import Spinner from '../../../components/spinner/spinner';
import { API_BASE_URL } from '../../../service/api-config';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, LineChart, CartesianGrid, XAxis, YAxis, Line } from 'recharts';
import './user-management.css';
import { getEvolutionData } from '../getEvolutionData';
import FeedbackModal from '../../../components/feedback-modal/feedback-modal';
import PaginationBar from '../../../components/pagination-bar/pagination-bar';

const base_url = API_BASE_URL;

export function meta() {
    return [
        { title: "Gestión de Usuarios | OptiTour" },
    ];
}

export default function UserManagement() {
    const navigate = useNavigate();
    const location = useLocation();
    const [users, setUsers] = useState<UserDTO[]>([]);
    const [totalUsers, setTotalUsers] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState<boolean>(location.state?.showModal);
    const [userDates, setUserDates] = useState<string[]>([]);
    const [chartError, setChartError] = useState<string | null>(null);
    const [banningUserId, setBanningUserId] = useState<number | null>(null);
    const [banError, setBanError] = useState<string | null>(null);

    async function handleLoadUsers(page: number, size: number) {
        setIsLoading(true);
        try {
            const response = await getPagedUsers(page, size);
            setUsers(response.content);
            setTotalUsers(response.page.totalElements);
            setTotalPages(response.page.totalPages);
            setCurrentPage(page);
        } catch (err) {
            err instanceof Error
                ? setError(err.message)
                : setError("Se ha producido un error al cargar los usuarios");
        } finally {
            setIsLoading(false);
        }
    }

    async function handleLoadChartData() {
        setIsLoading(true);
        try {
            const response = await getAllCreationDates();
            setUserDates(response.createdDates);
        }
        catch (err) {
            err instanceof Error
                ? setChartError(err.message)
                : setChartError("Se ha producido un error al cargar los datos del gráfico.");
        }
        finally {
            setIsLoading(false);
        }
    }

    async function handleBanButton(id: number, banned: boolean) {
        setBanningUserId(id);
        setBanError(null);
        try {
            const response = await changeIsUserBanned(id);
            setUsers(prev => prev.map(u => u.id === id ? response : u));
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

    function handleModalClose() {
        setShowModal(false);
        window.history.replaceState({}, '');
    }

    const pieChartData = [
        { name: "Activos", value: users.filter(u => !u.isBanned).length },
        { name: "Bloqueados", value: users.filter(u => u.isBanned).length }
    ];
    const COLORS = ['#26D12A', '#dc3545'];

    const evolutionData = getEvolutionData(userDates, date => date);

    useEffect(() => {
        handleLoadUsers(0, 10);
        handleLoadChartData();
    }, []);

    return (
        <div>
            <FeedbackModal
                show={showModal}
                onHide={handleModalClose}
                title={location.state?.modalTitle}
                message={location.state?.modalMessage}
                navButton={location.state?.navButton}
                navButtonText={location.state?.navButtonText}
                navUrl={location.state?.navUrl}
                buttonText={location.state?.buttonText}
            />
            <div className="ot-panel-header">
                <h1 className="ot-panel-title">Panel de gestión de usuarios</h1>

                <Button onClick={() => navigate('/admin/create')} className="ot-panel-action ot-panel-action--inline">
                    <i className="bi bi-plus-circle"></i>
                    Crear nueva cuenta de administración
                </Button>
            </div>

            <h2 className="ot-panel-subtitle">Información general</h2>

            <Row className="g-3 mb-3">
                <Col md={4}>
                    <StatCard value={String(totalUsers)} label="Usuarios totales" className="ot-stat-card--users" />
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
                    {chartError ? <ErrorCard text={chartError} /> :
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
                        </LineChart>}
                </ResponsiveContainer>
            </div>

            <h2 className="ot-panel-subtitle">Lista de usuarios registrados</h2>
            {banError && <ErrorCard text={banError} />}
            <div className="ot-user-list-container">
                {isLoading ? (
                    <div className="ot-spinner-wrap">
                        <Spinner />
                    </div>
                ) : error ? (
                    <ErrorCard text={error} />
                ) : (
                    users.map((user, index) => (
                        <div
                            key={user.id}
                            className="ot-poi-list-item"
                            style={{
                                animationDelay: `${index * 0.05}s`
                            }}
                        >
                            <UserListItem
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
                                                <>
                                                    {user.isBanned ? <i className="bi bi-unlock me-2"></i> : <i className="bi bi-lock me-2" />}
                                                    {user.isBanned ? 'Desbloquear' : 'Bloquear'}
                                                </>
                                            )}
                                        </Button>
                                        <Link to={`/admin/users/${user.id}`} className="btn btn-outline-dark">
                                            Ver perfil
                                        </Link>
                                    </>
                                }
                            />
                        </div>
                    ))
                )}
            </div>
            <PaginationBar
                totalPages={totalPages}
                currentPage={currentPage + 1}
                onPageChange={(page) => handleLoadUsers(page - 1, 10)}
                className="mt-4 pt-2"
            />
        </div>
    );
}