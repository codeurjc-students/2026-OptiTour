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
                    <Button variant="outline-dark" className="ot-account-fields__upload-btn">
                        Subir archivo
                    </Button>
                </Col>

                <Col md={8}>
                    <Row className="g-3">
                        <Col sm={6}>
                            <Form.Group controlId="accountEmail">
                                <Form.Label>Correo electrónico</Form.Label>
                                <Form.Control type="email" />
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            <Form.Group controlId="accountPhone">
                                <Form.Label>Número de teléfono</Form.Label>
                                <Form.Control type="tel" />
                            </Form.Group>
                        </Col>
                        <Col xs={12}>
                            <Form.Group controlId="accountUsername">
                                <Form.Label>Nombre de usuario</Form.Label>
                                <Form.Control type="text" />
                            </Form.Group>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Card>
    );
}

export default AccountFieldsCard;