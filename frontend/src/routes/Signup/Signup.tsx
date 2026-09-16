import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router';
import './Signup.css';

function Signup() {
    return (
        <div className="ot-register">
            <Container className="ot-register__container">
                <h1 className="ot-register__title">Registro de usuario</h1>

                <Card className="ot-register__card ot-register__card--main">
                    <Row className="g-4">
                        <Col md={4} className="ot-register__avatar-col">
                            <div className="ot-register__avatar">
                                <span>Imagen<br />de perfil</span>
                            </div>
                            <span className="ot-register__avatar-label">Foto de perfil</span>
                            <Button variant="outline-dark" className="ot-register__upload-btn">
                                Subir archivo
                            </Button>
                        </Col>

                        <Col md={8}>
                            <Row className="g-3">
                                <Col sm={6}>
                                    <Form.Group controlId="registerEmail">
                                        <Form.Label>Correo electrónico</Form.Label>
                                        <Form.Control type="email" />
                                    </Form.Group>
                                </Col>
                                <Col sm={6}>
                                    <Form.Group controlId="registerPhone">
                                        <Form.Label>Número de teléfono</Form.Label>
                                        <Form.Control type="tel" />
                                    </Form.Group>
                                </Col>
                                <Col xs={12}>
                                    <Form.Group controlId="registerUsername">
                                        <Form.Label>Nombre de usuario</Form.Label>
                                        <Form.Control type="text" />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Card>

                <Row className="g-4 ot-register__bottom">
                    <Col md={6}>
                        <Card className="ot-register__card ot-register__card--password">
                            <Form.Group controlId="registerPassword" className="ot-register__field">
                                <Form.Label>Contraseña</Form.Label>
                                <div className="ot-register__input-icon">
                                    <Form.Control type="password" />
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z" />
                                        <line x1="4" y1="20" x2="20" y2="4" />
                                    </svg>
                                </div>
                            </Form.Group>

                            <Form.Group controlId="registerPasswordRepeat" className="ot-register__field">
                                <Form.Label>Repetir contraseña</Form.Label>
                                <div className="ot-register__input-icon">
                                    <Form.Control type="password" />
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z" />
                                        <line x1="4" y1="20" x2="20" y2="4" />
                                    </svg>
                                </div>
                            </Form.Group>
                        </Card>
                    </Col>

                    <Col md={6}>
                        <Card className="ot-register__card ot-register__card--actions">
                            <Button type="submit" className="ot-register__submit">
                                Crear Cuenta
                            </Button>

                            <p className="ot-register__login-text">O inicia sesión si ya tienes cuenta:</p>

                            <Link to="/login" className="btn btn-outline-dark ot-register__login-btn">
                                Iniciar sesión
                            </Link>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Signup;