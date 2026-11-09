import { Button, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import StatCard from '../../components/stat-card/stat-card';
import ChartPlaceholder from '../../components/chart-placeholder/chart-placeholder';
import MediaListItem from '../../components/list-item/list-item';
import { useEffect, useState } from 'react';
import type { PointOfInterestDTO } from '../../dto/point-of-interest-dto';
import { getPoisByPage } from '../../service/point-of-interest-service';
import ErrorCard from '../../components/error-card/error-card';
import Spinner from '../../components/spinner/spinner';
import { API_BASE_URL } from '../../service/api-config';
import '../../components/tour-card/tour-card.css';
import './poi-management.css';

// React Router requires this route metadata export alongside the component.
// eslint-disable-next-line react-refresh/only-export-components
export function meta() {
    return [
        { title: "Gestión de Puntos de Interés | OptiTour" },
    ];
}

function POIManagement() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pois, setPois] = useState<PointOfInterestDTO[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [isLastPage, setIsLastPage] = useState<boolean>(false);

    async function handleGetPois(page: number, size: number) {
        try {
            const response = await getPoisByPage(page, size);
            setPois([...(pois || []), ...response.content])

            const newPage = currentPage + 1;
            setCurrentPage(newPage);

            setIsLastPage(response.page.number + 1 >= response.page.totalPages);
        } catch {
            setError("Se ha producido un error al cargar los datos de los puntos de interés.");
        } finally {
            setIsLoading(false);
        }
    }

    async function handleLoadMore() {
        setIsLoadingMore(true);
        await handleGetPois(currentPage, 5);
        setIsLoadingMore(false);
    }

    useEffect(() => {
        handleGetPois(currentPage, 10);
    }, []);

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

            {isLoading ? (
                <Spinner />
            ) : error ? (
                <ErrorCard text={error} />
            ) : (
                <>
                    {pois.map((poi) => (
                        <MediaListItem
                            key={poi.id}
                            title={poi.name}
                            imageSrc={`${API_BASE_URL}/image/${poi.images[0].id}`}
                            actions={
                                <>
                                    <Button variant="outline-dark" as={Link as any} to={`/point-of-interest/${poi.id}`}>Ver detalle</Button>
                                    <Button variant="outline-dark">Editar</Button>
                                    <Button variant="outline-danger">Eliminar</Button>
                                </>
                            }
                        />
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
                </>
            )}
        </div>
    );
}

export default POIManagement;
