import { Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import StatCard from '../../components/stat-card/stat-card';
import ChartPlaceholder from '../../components/chart-placeholder/chart-placeholder';
import MediaListItem from '../../components/list-item/list-item';

interface AdminPoi {
    id: number;
    title: string;
}

const pois: AdminPoi[] = [
    { id: 1, title: '<<Nombre punto de interés 1>>' },
    { id: 2, title: '<<Nombre punto de interés 2>>' },
    { id: 3, title: '<<Nombre punto de interés 3>>' },
    { id: 4, title: '<<Nombre punto de interés 4>>' },
];

function POIManagement() {
    const navigate = useNavigate();
    return (
        <div>
            <div className="ot-panel-header">
                <h1 className="ot-panel-title">Gestión de puntos de interés</h1>
                <Button onClick={() => navigate('/admin/addpoi')} className="ot-panel-action ot-panel-action--inline">Añadir punto de interés</Button>
            </div>

            <Row className="g-3 mb-3">
                <Col md={4}>
                    <StatCard value="200" label="Total de puntos de interés" />
                </Col>
                <Col md={8}>
                    <ChartPlaceholder type="line" label="Gráfico lineal de cantidad de puntos de interés" />
                </Col>
            </Row>

            {pois.map((poi) => (
                <MediaListItem
                    key={poi.id}
                    title={poi.title}
                    actions={
                        <>
                            <Button variant="outline-dark">Editar</Button>
                            <Button variant="outline-danger">Eliminar</Button>
                        </>
                    }
                />
            ))}
        </div>
    );
}

export default POIManagement;