import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router';
import logo from '../../assets/OptiTourLogo.png';
import './login.css';
import { login } from '../../service/auth-service';
import { useState, type SubmitEvent } from 'react';
import Spinner from '../../components/spinner/spinner';
import ErrorCard from '../../components/error-card/error-card';

function Login() {

  const navigate = useNavigate();

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();

    const formData = new FormData(event.target);

    try {
      setLoading(true);
      await login({
        email: formData.get("email") as string,
        password: formData.get("pass") as string
      });
      navigate("/");
    }
    catch (error) {
      setError("Credenciales incorrectas.");
    }
    finally {
      setLoading(false);
    }
  }

  return (
    <div className="ot-login">
      <Row className="ot-login__row g-0">
        <Col md={6} className="ot-login__visual">
          <div className="ot-login__visual-content">
            <img src={logo} alt="OptiTour" className="ot-login__visual-logo" />
            <p className="ot-login__visual-tagline">
              Rutas turísticas optimizadas para aprovechar cada minuto de tu viaje.
            </p>
          </div>
        </Col>

        <Col md={6} className="ot-login__panel">
          <Container className="ot-login__form-wrap">
            <h1 className="ot-login__title">Inicio de sesión</h1>

            <Form className="ot-login__form" onSubmit={handleSubmit}>
              <Form.Group className="ot-login__field" controlId="loginEmail">
                <Form.Label>Correo electrónico:</Form.Label>
                <Form.Control type="email" placeholder="" name="email" />
              </Form.Group>

              <Form.Group className="ot-login__field" controlId="loginPassword">
                <Form.Label>Contraseña:</Form.Label>
                <Form.Control type="password" placeholder="" name="pass" />
              </Form.Group>

              {loading && <Spinner />}

              {error &&
                <ErrorCard text={error} />
              }

              <Button type="submit" className="ot-login__submit">
                Acceder
              </Button>
            </Form>

            <p className="ot-login__register-text">O regístrate si no tienes cuenta</p>
            <Link to="/signup" className="btn btn-outline-dark ot-login__register-btn">
              Registrarse
            </Link>

            <Link to="/" className="btn btn-light ot-login__back-btn">
              <span className="ot-sidebar__link-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Z" />
                  <polyline points="9 21 9 12 15 12 15 21" />
                </svg>
              </span>
              Volver a la página principal
            </Link>
          </Container>
        </Col>
      </Row>
    </div>
  );
}

export default Login;
