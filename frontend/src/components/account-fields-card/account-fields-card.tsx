import { Card, Row, Col, Form, Button } from 'react-bootstrap';
import './account-fields-card.css';

interface AccountFieldsCardProps {
    avatarSrc?: string;
}

function AccountFieldsCard({ avatarSrc }: AccountFieldsCardProps) {
    return (
        <Card className="ot-account-fields">
            <Row className="g-4">
                <Col md={4} className="ot-account-fields__avatar-col">
                    <div className="ot-account-fields__avatar">
                        {avatarSrc ? (
                            <img src={avatarSrc} alt="Foto de perfil" />
                        ) : (
                            <span>Imagen<br />de perfil</span>
                        )}
                    </div>
                    <span className="ot-account-fields__avatar-label">Foto de perfil</span>
                    <Button variant="outline-dark" className="ot-account-fields__upload-btn" as="label" htmlFor="upload-image">
                        Subir archivo
                    </Button>
                    <input type="file" className="d-none" id="upload-image" name="image" accept=".png, .jpg, .webp" />
                </Col>

                <Col md={8}>
                    <Row className="g-3">
                        <Col sm={6}>
                            <Form.Group controlId="email">
                                <Form.Label>Correo electrónico</Form.Label>
                                <Form.Control type="email" name="email" required />
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            <Form.Group controlId="phone">
                                <Form.Label>Número de teléfono</Form.Label>
                                <Form.Control type="tel" name="phone" required />
                            </Form.Group>
                        </Col>
                        <Col xs={12}>
                            <Form.Group controlId="username">
                                <Form.Label>Nombre de usuario</Form.Label>
                                <Form.Control type="text" name="userName" required />
                            </Form.Group>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Card>
    );
}

export default AccountFieldsCard;
