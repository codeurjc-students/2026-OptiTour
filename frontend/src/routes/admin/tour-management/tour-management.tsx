import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PanelSearch from '../../../components/panel-search/panel-search';
import ListItem from '../../../components/list-item/list-item';
import PaginationBar from '../../../components/pagination-bar/pagination-bar';
import { useEffect, useState } from 'react';
import type { TourDTO } from '../../../dto/tour-dto';
import { getToursByPage } from '../../../service/tour-service';
import Spinner from '../../../components/spinner/spinner';
import ErrorCard from '../../../components/error-card/error-card';
import { API_BASE_URL } from '../../../service/api-config';
import './tour-management.css';

export function meta() {
    return [
        { title: "Gestión de Tours | OptiTour" },
    ];
}

export default function GestionToursPage() {
    const [tours, setTours] = useState<TourDTO[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(0);

    async function handleLoadTours(page: number, size: number) {
        setIsLoading(true);
        setError(null);
        try {
            const response = await getToursByPage(page, size);
            setTours(response.content);
            setTotalPages(response.page.totalPages);

            setCurrentPage(page);
        }
        catch (err) {
            err instanceof Error
                ? setError(err.message)
                : setError("Se ha producido un error al cargar los tours.");
        }
        finally {
            setIsLoading(false);
        }
    }

    useEffect(() => { handleLoadTours(0, 10) }, []);
    return (
        <div>
            <div className="ot-panel-header">
                <h1 className="ot-panel-title">Gestión de tours</h1>
                <Link to="/route-builder" className="btn ot-panel-action ot-panel-action--inline text-decoration-none">
                    Crear tour público
                </Link>
            </div>

            <h2 className="ot-panel-subtitle">Lista de tours</h2>
            <PanelSearch placeholder="Busca tours por nombre" />

            <div className="ot-tour-list-container">
                {isLoading ? (
                    <Spinner />
                ) : error ? (
                    <ErrorCard text={error} />
                ) : (
                    tours.map((tour, index) => (
                        <div
                            key={tour.id}
                            className="ot-tour-list-item"
                            style={{
                                animationDelay: `${index * 0.05}s`
                            }}
                        >
                            <ListItem
                                imageSrc={tour.images && tour.images.length > 0 ? `${API_BASE_URL}/image/${tour.images[0].id}` : undefined}
                                title={tour.name}
                                actions={
                                    <>
                                        <Button as={Link as any} to={`/admin/tours/${tour.id}/editar`}>
                                            Editar
                                        </Button>
                                        <Button as={Link as any} to={`/tour/${tour.id}`}>
                                            Detalle
                                        </Button>
                                        <Button variant="outline-danger">Eliminar</Button>
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
                onPageChange={(page) => { handleLoadTours(page - 1, 10) }} className="mt-4 pt-2" />
        </div>
    );
}