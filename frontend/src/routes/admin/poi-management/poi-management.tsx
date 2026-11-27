import { Button, Row, Col, Tooltip } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import StatCard from '../../../components/stat-card/stat-card';
import MediaListItem from '../../../components/list-item/list-item';
import { useEffect, useState } from 'react';
import type { PointOfInterestDTO } from '../../../dto/point-of-interest-dto';
import { deletePoiById, getPoisByPage, getPoisCreationDate } from '../../../service/point-of-interest-service';
import { API_BASE_URL } from '../../../service/api-config';
import './poi-management.css';
import '../user-management/user-management.css';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { getEvolutionData } from '../getEvolutionData';
import FeedbackModal from '../../../components/feedback-modal/feedback-modal';
import ActionModal from '../../../components/action-modal/action-modal';
import PaginationBar from '../../../components/pagination-bar/pagination-bar';
import Spinner from '../../../components/spinner/spinner';
import ErrorCard from '../../../components/error-card/error-card';

export function meta() {
    return [
        { title: "Gestión de Puntos de Interés | OptiTour" },
    ];
}

export default function POIManagement() {
    const location = useLocation()
    const navigate = useNavigate();
    const [pois, setPois] = useState<PointOfInterestDTO[]>([]);
    const [poiAmmount, setPoiAmmount] = useState<number>(0);
    const [showModal, setShowModal] = useState<boolean>(location.state?.showModal);
    const [showActionModal, setShowActionModal] = useState<boolean>(false);
    const [poiToDelete, setPoiToDelete] = useState<PointOfInterestDTO | null>(null);
    const [isLoadingDelete, setIsLoadingDelete] = useState<boolean>();
    const [deleteError, setDeleteError] = useState<string | null>();
    const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState<boolean>(false);
    const [deleteConfirmModalMessage, setDeleteConfirmModalMessage] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [pageError, setPageError] = useState<string | null>(null);
    const [poiDates, setPoiDates] = useState<string[]>([]);
    const [chartError, setChartError] = useState<string | null>(null);

    function handleModalClose() {
        setShowModal(false);
        window.history.replaceState({}, '');
    }

    function handleDeleteActionModalClose() {
        setShowActionModal(false);
        window.history.replaceState({}, '');
    }

    function handleDeleteConfirmModalClose() {
        setShowDeleteConfirmModal(false);
        window.history.replaceState({}, '');
    }

    function openActionModal(poiId: number) {
        setShowActionModal(true);
        setPoiToDelete(pois.find((poi) => { return poi.id == poiId })!);
    }

    async function handleDeletePoi(poiToDelete: PointOfInterestDTO) {
        setIsLoadingDelete(true);
        try {
            const response = await deletePoiById(poiToDelete.id);
            const newPoiAmmount = poiAmmount - 1;
            setPoiAmmount(newPoiAmmount);
            setPoiToDelete(null);
            handleDeleteActionModalClose()
            setShowDeleteConfirmModal(true);
            setDeleteConfirmModalMessage(`Se ha eliminado el siguiente punto de interés:\n${response.name}`);

            setPois(pois.filter((poi) => { return poi.id != response.id }));
        }
        catch (err) {
            setDeleteError("Se ha producido un error al borrar el punto de interés.");
        }
        finally {
            setIsLoadingDelete(false);
        }
    }

    async function handleLoadPois(page: number, size: number) {
        setIsLoading(true);
        setPageError(null);
        try {
            const response = await getPoisByPage(page, size);

            setPois(response.content);
            setTotalPages(response.page.totalPages);
            setPoiAmmount(response.page.totalElements);
        }
        catch (err) {
            err instanceof Error
                ? setPageError(err.message)
                : setPageError("Se ha producido un error al cargar la página " + page);
        }
        finally {
            setIsLoading(false);
        }
    }

    async function handleLoadDates() {
        setIsLoading(true);
        try {
            const response = await getPoisCreationDate();
            setPoiDates(response.createdDates);
        }
        catch (err) {
            err instanceof Error
                ? setChartError(err.message)
                : setChartError("Se ha producido un problema al cargar los datos del gráfico.")
        }
        finally {
            setIsLoading(false);
        }
    }

    const evolutionData = getEvolutionData(poiDates, date => date);

    useEffect(() => { handleLoadPois(0, 10); handleLoadDates() }, [])

    return (
        <>
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

            <FeedbackModal
                show={showDeleteConfirmModal}
                onHide={handleDeleteConfirmModalClose}
                title={"Se ha eliminado correctamente"}
                message={deleteConfirmModalMessage}
                buttonText={"Entendido"}
            />

            <ActionModal
                show={showActionModal}
                onHide={handleDeleteActionModalClose}
                title="¿Seguro que quieres borrar este punto de interés?"
                message={poiToDelete ? `Se borrará permanentemente el siguiente punto de interés:\n${poiToDelete!.name}\nSe desvinculará de cualquier tour en el que se visite, y sus imágenes también serán eliminadas del sistema.` : ""}
                actionButtonHandler={() => { handleDeletePoi(poiToDelete!) }}
                actionButtonText={isLoadingDelete ? "Borrando..." : "Sí, borrar"}
                closeButtonText="No, volver al panel"
                actionError={deleteError!}
            />

            <div>
                <div className="ot-panel-header">
                    <h1 className="ot-panel-title">Panel de gestión de puntos de interés</h1>
                    <Button onClick={() => navigate('/admin/addpoi')} className="ot-panel-action ot-panel-action--inline">
                        <i className="bi bi-plus-circle" />
                        Añadir punto de interés
                    </Button>
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
                        {chartError ? <ErrorCard text={chartError} /> :
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
                        }
                    </ResponsiveContainer>
                </div>

                <h2 className="ot-panel-subtitle">Lista de puntos de interés</h2>

                <div className="ot-poi-list-container">
                    {isLoading ? (
                        <Spinner />
                    ) : pageError ? (
                        <ErrorCard text={pageError} />
                    ) : (
                        pois.map((poi, index) => (
                            <div
                                key={poi.id}
                                className="ot-poi-list-item"
                                style={{
                                    animationDelay: `${index * 0.05}s`
                                }}
                            >
                                <MediaListItem
                                    title={poi.name}
                                    imageSrc={poi.images && poi.images.length > 0 ? `${API_BASE_URL}/image/${poi.images[0].id}` : undefined}
                                    actions={
                                        <>
                                            <Button variant="outline-dark" as={Link as any} to={`/point-of-interest/${poi.id}`}>Ver detalle</Button>
                                            <Button variant="outline-dark" as={Link as any} to={`/admin/poi/edit/${poi.id}`}>
                                                <i className="bi bi-pencil me-2"></i>
                                                Editar
                                            </Button>
                                            <Button variant="outline-danger" onClick={() => openActionModal(poi.id)}>
                                                <i className="bi bi-trash3 me-2" />
                                                Eliminar
                                            </Button>
                                        </>
                                    }
                                />
                            </div>
                        ))
                    )}
                </div>

                <PaginationBar
                    totalPages={totalPages}
                    onPageChange={(page) => { handleLoadPois(page - 1, 10) }}
                    className="mt-4 pt-2" />
            </div>
        </>
    );
}