import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import ImageCarousel from '../../components/image-carousel/image-carousel';
import ListItem from '../../components/list-item/list-item';
import GroupListItem from '../../components/group-list-item/group-list-item';
import './tour-detail.css';

interface PointOfInterest {
    id: number;
    title: string;
}

const pointsOfInterest: PointOfInterest[] = [
    { id: 1, title: 'Punto de interés 1' },
    { id: 2, title: 'Punto de interés 2' },
    { id: 3, title: 'Punto de interés 3' },
];

const publicGroups = ['Grupo 1', 'Grupo 2'];

function TourDetailPage() {
    return (
        <Container className="ot-tour-detail">
            <h1 className="ot-tour-detail__title">Título del Tour</h1>

            <Row className="g-4">
                <Col lg={8}>
                    <ImageCarousel slides={[{ title: 'Carrusel de imágenes del Tour', variant: 'primary' }]} />

                    <div className="ot-tour-detail__info">
                        <p className="ot-tour-detail__description">Descripción del Tour</p>
                        <p className="ot-tour-detail__price">Precio del tour (si procede)</p>
                    </div>

                    <h2 className="ot-tour-detail__poi-heading">
                        Lista de puntos de interés (ordenados en orden de visita)
                    </h2>

                    <div className="ot-tour-detail__poi-list">
                        {pointsOfInterest.map((poi) => (
                            <ListItem
                                key={poi.id}
                                title={poi.title}
                                to={`/poidetail`}
                                actionLabel="Ver más"
                            />
                        ))}
                    </div>
                </Col>

                <Col lg={4}>
                    <Card className="ot-tour-detail__sidebar-card">
                        <span className="ot-tour-detail__sidebar-heading">Grupos públicos</span>
                        {publicGroups.map((group) => (
                            <GroupListItem key={group} name={group} />
                        ))}
                    </Card>

                    <Card className="ot-tour-detail__sidebar-card ot-tour-detail__cta-card">
                        <Button variant="outline-dark" className="ot-tour-detail__cta-btn">
                            Iniciar sesión para apuntarse
                        </Button>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default TourDetailPage;