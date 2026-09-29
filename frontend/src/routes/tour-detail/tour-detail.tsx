import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import ImageCarousel from '../../components/image-carousel/image-carousel';
import ListItem from '../../components/list-item/list-item';
import GroupListItem from '../../components/group-list-item/group-list-item';
import './tour-detail.css';
import type { TourDTO } from '../../dto/tour-dto';
import { useEffect, useState } from 'react';
import { getTourById } from '../../service/tour-service';
import { useParams, useLocation, Link } from 'react-router-dom';
import Spinner from '../../components/spinner/spinner';
import ErrorPage from '../../components/error-page/error-page';
import { ApiError } from '../../service/api-error';
import { useAuthStore } from '../../store/auth-store';

const publicGroups = ['Grupo 1', 'Grupo 2'];

function TourDetailPage() {

    const [tour, setTour] = useState<TourDTO>();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [errCode, setErrCode] = useState<number | null>(null);
    const [errTitle, setErrTitle] = useState<string | null>(null);

    const { loggedUser } = useAuthStore();

    const { id } = useParams();
    const location = useLocation();

    async function handleLoadTour() {
        try {
            setLoading(true);
            const response = await getTourById(Number(id));
            setTour(response);
        }
        catch (error) {
            if (error instanceof ApiError) {
                setError(error.message);
                setErrCode(error.status);
                setErrTitle(error.errorTitle);
            }
            else
                setError("No se han obtener los datos del tour del servidor. Inténtalo de nuevo más tarde");
        }
        finally {
            setLoading(false);
        }

    }

    useEffect(() => { handleLoadTour(); }, []);

    // If this hooks are not null, then recevied error is an ApiError. 
    // We catch all information from api so we can show api messages on screen if tour is not found:
    if (error)
        if (errCode && errTitle) {
            let errorPageMessage: string = '';

            errCode == 404 ? errorPageMessage = "Tour no encontrado" : errorPageMessage = error!;

            return (
                <ErrorPage errNum={errCode} errText={error!} errTitle={errorPageMessage} />
            );
        }
        else
            return (<ErrorPage errNum={503} errText={error} errTitle={"El servidor no responde"} />)

    return (
        <>
            {loading ? <Spinner /> : <Container className="ot-tour-detail">
                <h1 className="ot-tour-detail__title">{tour?.name}</h1>

                <Row className="g-4">
                    <Col lg={8}>
                        <ImageCarousel slides={[{ title: 'Carrusel de imágenes del Tour', variant: 'primary' }]} />

                        <dl className="ot-tour-detail__data">
                            <div className="ot-tour-detail__data-row">
                                <dt>Descripción</dt>
                                <dd>{tour?.description}</dd>
                            </div>
                            <div className="ot-tour-detail__data-row">
                                <dt>Precio</dt>
                                <dd>Precio del tour (si procede)</dd>
                            </div>
                        </dl>

                        <h2 className="ot-tour-detail__poi-heading">
                            Lista de puntos de interés (ordenados en orden de visita)
                        </h2>

                        <div className="ot-tour-detail__poi-list">
                            {tour?.pois.map((poi) => (
                                <ListItem
                                    key={poi.id}
                                    title={poi.name}
                                    to={`/poidetail`}
                                    actionLabel="Ver más"
                                />
                            ))}
                        </div>
                    </Col>

                    {loggedUser ? (
                        <Col lg={4}>
                            <Card className="ot-tour-detail__sidebar-card">
                                <span className="ot-tour-detail__sidebar-heading">Amigos que se han apuntado</span>
                                <GroupListItem name="Amigo 1" />

                                <span className="ot-tour-detail__sidebar-heading mt-4">Grupos en común / Grupos públicos</span>
                                <GroupListItem name="Grupo 1" />
                            </Card>

                            <Card className="ot-tour-detail__sidebar-card ot-tour-detail__cta-card">
                                <span className="ot-tour-detail__sidebar-heading">¡Apúntate ya!</span>
                                <Button variant="outline-dark" className="ot-tour-detail__cta-btn">
                                    Apuntarme al Tour
                                </Button>
                            </Card>
                        </Col>
                    ) :
                        <Col lg={4}>
                            <Card className="ot-tour-detail__sidebar-card">
                                <span className="ot-tour-detail__sidebar-heading">Grupos públicos</span>
                                {publicGroups.map((group) => (
                                    <GroupListItem key={group} name={group} />
                                ))}
                            </Card>

                            <Card className="ot-tour-detail__sidebar-card ot-tour-detail__cta-card">
                                <span className="ot-tour-detail__sidebar-heading">¿Quieres unirte al tour?</span>
                                <Link to={`/login?redirect=${encodeURIComponent(location.pathname)}&errorCard=false`} className="btn btn-outline-dark ot-tour-detail__cta-btn">
                                    Iniciar sesión para apuntarse
                                </Link>
                            </Card>
                        </Col>}
                </Row>
            </Container>}

        </>
    );
}

export default TourDetailPage;
