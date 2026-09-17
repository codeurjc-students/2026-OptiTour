import { Container, Row, Col, Card } from 'react-bootstrap';
import ImageCarousel from '../../components/ImageCarousel/ImageCarousel';
import ListItem from '../../components/ListItem/ListItem';
import './PointOfInterestDetail.css';

interface TourSummary {
    id: number;
    title: string;
}

const relatedTours: TourSummary[] = [
    { id: 1, title: 'Tour 1' },
    { id: 2, title: 'Tour 2' },
    { id: 3, title: 'Tour 3' },
    { id: 4, title: 'Tour 4' },
    { id: 5, title: 'Tour 5' },
];

function PointOfInterestDetailPage() {
    return (
        <Container className="ot-poi-detail">
            <h1 className="ot-poi-detail__title">Título del punto de interés</h1>

            <Row className="g-4">
                <Col lg={7}>
                    <ImageCarousel
                        slides={[{ title: 'Carrusel de imágenes del punto de interés', variant: 'primary' }]}
                    />

                    <dl className="ot-poi-detail__data">
                        <div className="ot-poi-detail__data-row">
                            <dt>Descripción</dt>
                            <dd>Descripción del punto de interés</dd>
                        </div>
                        <div className="ot-poi-detail__data-row">
                            <dt>Ciudad y dirección</dt>
                            <dd>Ciudad y dirección</dd>
                        </div>
                        <div className="ot-poi-detail__data-row">
                            <dt>Coordenadas</dt>
                            <dd>Coordenadas</dd>
                        </div>
                    </dl>
                </Col>

                <Col lg={5}>
                    <Card className="ot-poi-detail__sidebar-card">
                        <span className="ot-poi-detail__sidebar-heading">Tours en los que se visita</span>
                        <div className="ot-poi-detail__tour-list">
                            {relatedTours.map((tour) => (
                                <ListItem
                                    key={tour.id}
                                    title={tour.title}
                                    to={`/tourdetail`}
                                    actionLabel="Ver más"
                                    size="sm"
                                />
                            ))}
                        </div>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default PointOfInterestDetailPage;