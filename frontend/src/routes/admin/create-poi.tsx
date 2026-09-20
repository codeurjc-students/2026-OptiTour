import { Card, Form, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router';
import './create-poi.css';

function CreatePointOfInterest() {
    return (
        <div className="ot-create-poi">
            <h1 className="ot-panel-title">Añadir punto de interés</h1>

            <Card className="ot-create-poi__card">
                <Form.Group controlId="poiName" className="ot-create-poi__field">
                    <Form.Label>Nombre del punto de interés</Form.Label>
                    <Form.Control type="text" />
                </Form.Group>

                <Form.Group className="ot-create-poi__field">
                    <Form.Label>Imágenes</Form.Label>
                    <div className="ot-create-poi__images">
                        <div className="ot-create-poi__image-slot"><span>Img</span></div>
                        <div className="ot-create-poi__image-slot"><span>Img</span></div>
                        <div className="ot-create-poi__image-slot"><span>Img</span></div>
                        <Button variant="outline-dark" className="ot-create-poi__upload-btn">
                            Subir imágenes
                        </Button>
                    </div>
                </Form.Group>

                <Form.Group controlId="poiDescription" className="ot-create-poi__field">
                    <Form.Label>Descripción</Form.Label>
                    <Form.Control as="textarea" rows={4} />
                </Form.Group>

                <Row className="g-3 ot-create-poi__field">
                    <Col md={6}>
                        <Form.Group controlId="poiCity">
                            <Form.Label>Ciudad</Form.Label>
                            <Form.Control type="text" />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="poiAddress">
                            <Form.Label>Dirección</Form.Label>
                            <Form.Control type="text" />
                        </Form.Group>
                    </Col>
                </Row>

                <Row className="g-3 ot-create-poi__field ot-create-poi__field--last">
                    <Col md={6}>
                        <Form.Group controlId="poiLat">
                            <Form.Label>Latitud</Form.Label>
                            <Form.Control type="text" placeholder="Ej. 40.4168" />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="poiLng">
                            <Form.Label>Longitud</Form.Label>
                            <Form.Control type="text" placeholder="Ej. -3.7038" />
                        </Form.Group>
                    </Col>
                </Row>
            </Card>

            <div className="ot-create-poi__actions">
                <Button type="submit" className="ot-create-poi__submit">
                    Crear punto de interés
                </Button>
                <Link to="/admin/poi" className="btn btn-outline-dark ot-create-poi__cancel-btn">
                    Cancelar
                </Link>
            </div>
        </div>
    );
}

export default CreatePointOfInterest;