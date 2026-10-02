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
import type { ImageDTO } from '../../dto/image-dto';

const base_url = import.meta.env.VITE_API_BASE_URL ? `${import.meta.env.VITE_API_BASE_URL}` : "https://localhost:443/api/v1";

const publicGroups = ['Grupo 1', 'Grupo 2'];

function TourDetailPage() {

    const [tour, setTour] = useState<TourDTO>();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [errTitle, setErrTitle] = useState<string | null>(null);
    const [errCode, setErrCode] = useState<number | null>(null);
    const [imageUrls, setImagesUrls] = useState<string[]>([]);


    const { loggedUser } = useAuthStore();

    const { id } = useParams();
    const location = useLocation();

    async function handleLoadTour() {
        try {
            setLoading(true);
            const response = await getTourById(Number(id));
            setTour(response);

            response.images.map((image: ImageDTO) => imageUrls.push(`${base_url}/image/${image.id}`));
            setImagesUrls(imageUrls);
        }
        catch (err) {
            if (err instanceof ApiError) {
                setError(err.message);
                setErrCode(err.status);
                setErrTitle(err.errorTitle);
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

            errCode == 404 ? errorPageMessage = "Tour no encontrado" : errorPageMessage = errTitle!;

            return (
                <ErrorPage errNum={errCode} errText={error!} errTitle={errorPageMessage} />
            );
        }
        else
            return (<ErrorPage errNum={503} errText={error} errTitle={"El servidor no responde. Inténtalo de nuevo más tarde"} />)

    return (
        <>
            {loading ? <Spinner /> : <Container className="ot-tour-detail">
                <h1 className="ot-tour-detail__title">{tour?.name}</h1>

                <Row className="g-4">
                    <Col lg={8}>
                        <ImageCarousel
                            images={imageUrls}
                        />

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
                                    desc={poi.description}
                                    to={`/point-of-interest/${poi.id}`}
                                    actionLabel="Ver más"
                                    imageSrc={poi.images.length > 0
                                        ? `${base_url}/image/${poi.images[0].id}`
                                        : undefined}
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
