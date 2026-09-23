import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router';
import AccountFieldsCard from '../../components/account-fields-card/account-fields-card';
import PasswordFieldsCard from '../../components/password-fields-card/password-fields-card';
import './signup.css';

function Signup() {
    return (
        <div className="ot-register">
            <Container className="ot-register__container">
                <h1 className="ot-register__title">Registro de usuario</h1>

                <div className="ot-register__main">
                    <AccountFieldsCard />
                </div>

                <Row className="g-4 ot-register__bottom mt-2">
                    <Col md={6}>
                        <PasswordFieldsCard />
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