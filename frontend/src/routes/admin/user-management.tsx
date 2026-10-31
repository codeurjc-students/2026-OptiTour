import { Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import StatCard from '../../components/stat-card/stat-card';
import ChartPlaceholder from '../../components/chart-placeholder/chart-placeholder';
import UserListItem from '../../components/user-list-item/user-list-item';
import { useEffect, useState } from 'react';
import type { UserDTO } from '../../dto/user-dto';
import { changeIsUserBanned, getAllUsers } from '../../service/user-service';
import Spinner from '../../components/spinner/spinner';
import ErrorCard from '../../components/error-card/error-card';
import { API_BASE_URL } from '../../service/api-config';

const base_url = API_BASE_URL;

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
            banned
                ? setBanError("Se ha producido un error al desbloquear el usuario")
                : setBanError("Se ha producido un error al bloquear el usuario");
        }
        finally {
            setBanningUserId(null);
        }
    }

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

                    <Row className="g-3 mb-3">
                        <Col md={4}>
                            <StatCard value={String(users.length)} label="Usuarios totales" />
                        </Col>
                        <Col md={8}>
                            <ChartPlaceholder type="pie" label="Gráfico de tarta de usuarios activos" />
                        </Col>
                    </Row>

                    <div className="mb-4">
                        <ChartPlaceholder type="bar" label="Gráfico lineal de evolución de usuarios" />
                    </div>

                    {banError && <ErrorCard text={banError} />}

                    {users.map((user) => (
                        <UserListItem
                            key={user.id}
                            userName={user.userName}
                            avatarSrc={`${base_url}/user/${user.id}/image`}
                            actions={
                                <>
                                    <Button
                                        variant={user.isBanned ? 'outline-success' : 'outline-danger'}
                                        onClick={() => handleBanButton(user.id, user.isBanned)}
                                        disabled={banningUserId === user.id}
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
                                    <Button variant="outline-dark">Ver perfil</Button>
                                </>
                            }
                        />
                    ))}
                </div>
            )}
        </>
    );
}
