import { Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import StatCard from '../../components/stat-card/stat-card';
import ChartPlaceholder from '../../components/chart-placeholder/chart-placeholder';
import UserListItem from '../../components/user-list-item/user-list-item';

interface AdminUser {
    id: number;
    name: string;
    blocked: boolean;
}


const users: AdminUser[] = [
    { id: 1, name: '<<Nombre de usuario 1>>', blocked: false },
    { id: 2, name: '<<Nombre de usuario 2>>', blocked: true },
    { id: 3, name: '<<Nombre de usuario 3>>', blocked: false },
];

function UserManagement() {
    const navigate = useNavigate();
    return (
        <div>
            <div className="ot-panel-header">
                <h1 className="ot-panel-title">Gestión de usuarios</h1>
                <Button onClick={() => navigate('/admin/create')} className="ot-panel-action ot-panel-action--inline">
                    Crear nueva cuenta de administración
                </Button>
            </div>

            <Row className="g-3 mb-3">
                <Col md={4}>
                    <StatCard value="150" label="Usuarios totales" />
                </Col>
                <Col md={8}>
                    <ChartPlaceholder type="pie" label="Gráfico de tarta de usuarios activos" />
                </Col>
            </Row>

            <div className="mb-4">
                <ChartPlaceholder type="bar" label="Gráfico lineal de evolución de usuarios" />
            </div>

            {users.map((user) => (
                <UserListItem
                    key={user.id}
                    userName={user.name}
                    actions={
                        <>
                            <Button variant={user.blocked ? 'outline-success' : 'outline-danger'}>
                                {user.blocked ? 'Desbloquear' : 'Bloquear'}
                            </Button>
                            <Button variant="outline-dark">Ver perfil</Button>
                        </>
                    }
                />
            ))}
        </div>
    );
}

export default UserManagement;