import { Button, Row, Col, Tooltip } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import StatCard from '../../components/stat-card/stat-card';
import MediaListItem from '../../components/list-item/list-item';
import { useEffect, useState } from 'react';
import type { PointOfInterestDTO } from '../../dto/point-of-interest-dto';
import { getPoisByPage } from '../../service/point-of-interest-service';
import ErrorCard from '../../components/error-card/error-card';
import Spinner from '../../components/spinner/spinner';
import { API_BASE_URL } from '../../service/api-config';
import '../../components/tour-card/tour-card.css';
import './poi-management.css';
import './user-management.css';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

// React Router requires this route metadata export alongside the component.
// eslint-disable-next-line react-refresh/only-export-components
export function meta() {
    return [
        { title: "Gestión de Puntos de Interés | OptiTour" },
    ];
}

export default function POIManagement() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pois, setPois] = useState<PointOfInterestDTO[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [isLastPage, setIsLastPage] = useState<boolean>(false);
    const [poiAmmount, setPoiAmmount] = useState<number>(0);

    async function handleGetPois(page: number, size: number, isUseEffect: boolean) {
        try {
            const response = await getPoisByPage(page, size);
            setPois([...(pois || []), ...response.content])

            const newPage = currentPage + 1;
            setCurrentPage(newPage);

            setIsLastPage(response.page.number + 1 >= response.page.totalPages);

            if (isUseEffect)
                setPoiAmmount(response.page.totalElements);
        } catch {
            setError("Se ha producido un error al cargar los datos de los puntos de interés.");
        } finally {
            setIsLoading(false);
        }
    }

    async function handleLoadMore() {
        setIsLoadingMore(true);
        await handleGetPois(currentPage, 5, false);
        setIsLoadingMore(false);
    }

    useEffect(() => {
        handleGetPois(currentPage, 10, true);
    }, []);

    const evolutionData = pois
        .filter(p => p.createdAt)
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        .reduce((acc, poi) => {
            const date = new Date(poi.createdAt);
            const month = date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
            const period = month.charAt(0).toUpperCase() + month.slice(1);

            const existing = acc.find(item => item.period === period);
            if (existing)
                existing.new += 1
            else
                acc.push({ period, new: 1, total: 0 });

            return acc;
        }, [] as { period: string, new: number, total: number }[])
        .map((item, index, arr) => {
            item.total = arr.slice(0, index + 1).reduce((sum, current) => sum + current.new, 0);
            return item;
        });

    return (
        <>
            {isLoading ? <Spinner /> :

                <div>
                    <div className="ot-panel-header">
                        <h1 className="ot-panel-title">Gestión de puntos de interés</h1>
                        <Button onClick={() => navigate('/admin/addpoi')} className="ot-panel-action ot-panel-action--inline">Añadir punto de interés</Button>
                    </div>

                    <Row className="g-3 mb-3">
                        <Col xs={12}>
                            <StatCard value={`${poiAmmount}`} label="Total de puntos de interés"
                                className="ot-stat-card--users" />
                        </Col>
                    </Row>

                    <div className="ot-chart-card mb-4">
                        <h3 className="ot-chart-title">Evolución de puntos de interés registrados</h3>
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
                                    name="Puntos de interés acumulados"
                                    stroke="#26D12A"
                                    strokeWidth={3}
                                    dot={{ r: 4 }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {error ? (
                        <ErrorCard text={error} />
                    ) : (
                        <>
                            {pois.map((poi, index) => (
                                <div
                                    key={poi.id}
                                    className="ot-poi-list-item"
                                    style={{
                                        animationDelay: `${(index < 10 ? index : (index - 10) % 5) * 0.05}s`
                                    }}
                                >
                                    <MediaListItem
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
                        </>
                    )}
                </div>

            }
        </>
    );
}