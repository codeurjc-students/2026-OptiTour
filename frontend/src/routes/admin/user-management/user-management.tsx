import { Button, Row, Col } from 'react-bootstrap';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import StatCard from '../../../components/stat-card/stat-card';
import UserListItem from '../../../components/user-list-item/user-list-item';
import { useEffect, useState } from 'react';
import type { UserDTO } from '../../../dto/user-dto';
import { changeIsUserBanned, getPagedUsers } from '../../../service/user-service';
import Spinner from '../../../components/spinner/spinner';
import ErrorCard from '../../../components/error-card/error-card';
import { API_BASE_URL } from '../../../service/api-config';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, LineChart, CartesianGrid, XAxis, YAxis, Line } from 'recharts';
import '../../../components/tour-card/tour-card.css';
import './user-management.css';
import { getEvolutionData } from '../getEvolutionData';
import FeedbackModal from '../../../components/feedback-modal/feedback-modal';

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
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [totalUsers, setTotalUsers] = useState<number>(0);
    const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
    const [isLastPage, setIsLastPage] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [showModal, setShowModal] = useState<boolean>(location.state?.showModal);

    function handleModalClose() {
        setShowModal(false);
        window.history.replaceState({}, '');
    }

    async function handleGetPagedUsers(page: number, size: number, isUseEffect: boolean) {
        try {
            const response = await getPagedUsers(page, size);
            setUsers([...(users || []), ...response.content]);

            if (isUseEffect) {
                setTotalUsers(response.page.totalElements);
                const newPage = currentPage + 2;
                setCurrentPage(newPage)
            }
            else {
                const newPage = currentPage + 1;
                setCurrentPage(newPage);
            }

            setIsLastPage(response.page.number + 1 >= response.page.totalPages);
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

    async function handleLoadMore() {
        setIsLoadingMore(true);
        await handleGetPagedUsers(currentPage, 5, false);
        setIsLoadingMore(false);
    }

    useEffect(() => {
        handleGetPagedUsers(currentPage, 10, true);
    }, []);

    const [banningUserId, setBanningUserId] = useState<number | null>(null);
    const [banError, setBanError] = useState<string | null>(null);

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

    const pieChartData = [
        { name: "Activos", value: users.filter(u => !u.isBanned).length },
        { name: "Bloqueados", value: users.filter(u => u.isBanned).length }
    ];

    const COLORS = ['#26D12A', '#dc3545'];

    const evolutionData = getEvolutionData(users, u => u.createdAt);

    return (
        <>
            {isLoading ? (
                <Spinner />
            ) : error ? (
                <ErrorCard text={error} />
            ) : (
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
                    {users.map((user, index) => (
                        <div
                            key={user.id}
                            className="ot-poi-list-item"
                            style={{
                                animationDelay: `${(index < 10 ? index : (index - 10) % 5) * 0.05}s`
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
                                                user.isBanned ? 'Desbloquear' : 'Bloquear'
                                            )}
                                        </Button>
                                        <Link to={`/admin/users/${user.id}`} className="btn btn-outline-dark">
                                            Ver perfil
                                        </Link>
                                    </>
                                }
                            />
                        </div>
                    ))}
                    <div className="text-center mt-5 mb-4">
                        {isLoadingMore ? <div className="ot-poi-load-more-spinner"><Spinner /></div>
                            : !isLastPage && <Button
                                variant="outline-success"
                                className="ot-tour-card__btn d-inline-flex align-items-center justify-content-center load-more-button"
                                style={{ gap: '0.5rem' }}
                                onClick={handleLoadMore}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z" />
                                    <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466" />
                                </svg>
                                Cargar más
                            </Button>}
                    </div>
                </div>
            )}
        </>
    );
}