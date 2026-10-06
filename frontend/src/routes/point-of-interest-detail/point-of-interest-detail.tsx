import { Container, Row, Col, Card } from 'react-bootstrap';
import ImageCarousel from '../../components/image-carousel/image-carousel';
import ListItem from '../../components/list-item/list-item';
import './point-of-interest-detail.css';
import { useEffect, useState } from 'react';
import type { PointOfInterestDTO } from '../../dto/point-of-interest-dto';
import { getPoiById } from '../../service/point-of-interest-service';
import { useParams } from 'react-router-dom';
import Spinner from '../../components/spinner/spinner';
import { ApiError } from '../../service/api-error';
import ErrorPage from '../../components/error-page/error-page';
import InteractiveMap from '../../components/interactive-map/interactive-map';
import type { ImageDTO } from '../../dto/image-dto';
import { API_BASE_URL } from '../../service/api-config';

const base_url = API_BASE_URL;

export default function PointOfInterestDetail() {

    const [poi, setPoi] = useState<PointOfInterestDTO>();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [errTitle, setErrTitle] = useState<string | null>(null);
    const [errCode, setErrCode] = useState<number | null>(null);
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const { id } = useParams();

    async function handleGetPoi(id: number) {
        try {
            setLoading(true);
            const response = await getPoiById(id);
            setPoi(response);

            setImageUrls((response.images ?? []).map((image: ImageDTO) => `${base_url}/image/${image.id}`));
        }
        catch (err) {
            if (err instanceof ApiError) {
                setError(err.message);
                setErrCode(err.status);
                setErrTitle(err.errorTitle);
            }
            else
                setError("No se han podido cargar los datos del punto de interés del servidor. Inténtalo de nuevo más tarde.")
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => { handleGetPoi(Number(id)) }, []);

    if (error) {
        if (errTitle && errCode) {
            let errorPageTitle = errCode == 404 ? "Punto de interés no encontrado" : errTitle;
            return (<ErrorPage errNum={errCode} errTitle={errorPageTitle} errText={error} />);
        }

        else
            return (<ErrorPage errNum={503} errTitle={"El servidor no responde. Inténtalo de nuevo más tarde"} errText={error} />)
    }

    return (
        <>
            {
                loading ? <Spinner /> :
                    <Container className="ot-poi-detail">
                        <h1 className="ot-poi-detail__title">{poi?.name}</h1>

                        <Row className="g-4">
                            <Col lg={7}>
                                <ImageCarousel
                                    images={imageUrls}
                                />

                                <dl className="ot-poi-detail__data">
                                    <div className="ot-poi-detail__data-row">
                                        <dt>Descripción</dt>
                                        <dd>{poi?.description}</dd>
                                    </div>
                                    <div className="ot-poi-detail__data-row">
                                        <dt>Ciudad y dirección</dt>
                                        <dd>{poi?.city}: {poi?.address}</dd>
                                    </div>
                                    <div className="ot-poi-detail__data-row">
                                        <dt>Mapa</dt>
                                        <dd><InteractiveMap coords={poi?.coords} /></dd>
                                    </div>
                                    <div className="ot-poi-detail__data-row">
                                        <dt>Coordenadas</dt>
                                        <dd>{poi?.coords}</dd>
                                    </div>
                                </dl>
                            </Col>

                            <Col lg={5}>
                                <Card className="ot-poi-detail__sidebar-card">
                                    <span className="ot-poi-detail__sidebar-heading">Tours en los que se visita</span>
                                    <div className="ot-poi-detail__tour-list">
                                        {poi?.tours.map((tour) => (
                                            <ListItem
                                                key={tour.id}
                                                title={tour.name}
                                                to={`/tour/${tour.id}`}
                                                actionLabel="Ver más"
                                                size="sm"
                                                imageSrc={tour.images?.length
                                                    ? `${base_url}/image/${tour.images[0].id}`
                                                    : undefined}
                                            />
                                        ))}
                                    </div>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
            }
        </>
    );
}