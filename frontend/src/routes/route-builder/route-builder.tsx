import { Container, Row, Col, Button } from 'react-bootstrap';
import InteractiveMap from '../../components/interactive-map/interactive-map';
import ListItem from '../../components/list-item/list-item';
import PanelSearch from '../../components/panel-search/panel-search';
import './route-builder.css';

interface PointOfInterest {
    id: number;
    title: string;
}

const searchResults: PointOfInterest[] = [
    { id: 1, title: '<<Punto de interés 1>>' },
    { id: 2, title: '<<Punto de interés 2>>' },
    { id: 3, title: '<<Punto de interés 3>>' },
];

const walkIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round">
        <circle cx="13" cy="4" r="2" />
        <path d="M13 6.5 10.5 11l3 2.5.5 7.5" />
        <path d="m10.5 11-3 1.5L6 16" />
        <path d="m13.5 13.5 3.5 1.5" />
    </svg>
);

const carIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 17h14v-4l-1.8-4.2A2 2 0 0 0 15.4 7H8.6a2 2 0 0 0-1.8 1.2L5 13v4Z" />
        <path d="M5 13h14" />
        <circle cx="8" cy="17" r="1.5" />
        <circle cx="16" cy="17" r="1.5" />
    </svg>
);

function RouteBuilderPage() {
    return (
        <Container fluid className="ot-route-builder">
            <Row className="g-3">
                <Col lg={8} className="ot-route-builder__map-col">
                    <InteractiveMap />
                </Col>

                <Col lg={4}>
                    <aside className="ot-route-builder__panel">
                        <PanelSearch placeholder="Busca puntos de interés" />

                        <div className="ot-route-builder__results-card">
                            {searchResults.map((poi) => (
                                <ListItem
                                    key={poi.id}
                                    title={poi.title}
                                    layout="stacked"
                                    actions={
                                        <>
                                            <Button className="ot-route-builder__add-btn">Añadir al tour</Button>
                                            <Button href="/poidetail" variant="outline-dark">
                                                Ver detalle
                                            </Button>
                                        </>
                                    }
                                />
                            ))}
                        </div>

                        <div className="ot-route-builder__calc-card">
                            <Button variant="outline-dark" className="ot-route-builder__calc-btn">
                                <span className="ot-route-builder__calc-icon">{walkIcon}</span>
                                Calcular ruta a pie
                            </Button>
                            <Button variant="outline-dark" className="ot-route-builder__calc-btn">
                                <span className="ot-route-builder__calc-icon">{carIcon}</span>
                                Calcular ruta en coche
                            </Button>
                        </div>
                    </aside>
                </Col>
            </Row>
        </Container>
    );
}

export default RouteBuilderPage;
