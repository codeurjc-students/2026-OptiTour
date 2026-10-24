import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/OptiTourLogo.png';
import './login.css';
import { useAuthStore } from '../../store/auth-store';
import { useEffect, useState } from 'react';
import ErrorCard from '../../components/error-card/error-card';
import PasswordInput from '../../components/password-input/password-input';
import { useSearchParams } from 'react-router-dom';
import { API_BASE_URL } from '../../service/api-config';
import { loginSchema } from '../../schemas/login-schema';
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import type z from 'zod';

const base_url = API_BASE_URL;

function Login() {

  const navigate = useNavigate();
  const { doLogin } = useAuthStore();

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchParams] = useSearchParams();
  const [randomId, setRandomId] = useState<number>();

  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors }
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    mode: "onChange"
  });


  async function handleSubmit(data: z.infer<typeof loginSchema>) {
    try {
      setLoading(true);

      // We don't need to use safeParse manually, because here data are parsed by zod
      await doLogin({
        email: data.email,
        password: data.password
      });

      const redirectTo = searchParams.get("redirect") || "/";
      navigate(redirectTo, { replace: true });
    }
    catch (err) {
      if (err instanceof Error && err.message == "Forbidden")
        setError("Credenciales incorrectas")
      else
        err instanceof Error
          ? setError(err.message)
          : setError("Se ha producido un error en la autenticación.");
    }
    finally {
      setLoading(false);
    }
  }

  function handleRandom(max: number) {
    setRandomId(Math.floor(Math.random() * max) + 1);
  }

  useEffect(() => { handleRandom(540) }, []);

  return (
    <div className="ot-login">
      <Row className="ot-login__row g-0">
        <Col md={6} className="ot-login__visual" style={{
          backgroundImage: `url("${base_url}/image/${randomId}")`
        }}>
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

            {searchParams.get("redirect") && searchParams.get("errorCard") === "true" && <ErrorCard text={`Para acceder a la página solicitada necesitas autenticación.`} />}

            <Form className="ot-login__form" onSubmit={handleFormSubmit(handleSubmit)} noValidate>
              <Form.Group className="ot-login__field" controlId="loginEmail">
                <Form.Label>Correo electrónico:</Form.Label>
                <Form.Control type="email"
                  {...register("email")}
                  isInvalid={!!errors.email}
                  placeholder="" />
                <Form.Control.Feedback type="invalid">
                  {errors.email?.message}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="ot-login__field" controlId="loginPassword">
                <Form.Label>Contraseña:</Form.Label>
                <PasswordInput
                  {...register("password")}
                  isInvalid={!!errors.password}
                  placeholder=""
                />
                {errors.password && (
                  <div className="invalid-feedback d-block">
                    {errors.password.message}
                  </div>
                )}
              </Form.Group>

              {error &&
                <ErrorCard text={error} />
              }

              <Button
                type="submit"
                className="ot-login__submit"
                disabled={loading}
                aria-busy={loading}
              >
                <span className="ot-login__spinner-slot" data-loading={loading}>
                  <span className="ot-login__spinner" role="status" aria-label="Iniciando sesión" />
                </span>
                <span>Acceder</span>
              </Button>
            </Form>

            <p className="ot-login__register-text">O regístrate si no tienes cuenta</p>
            <Link to="/signup" className="btn btn-outline-dark ot-login__register-btn">
              Registrarse
            </Link>
          </Container>

          <div className="ot-login__back-actions">
            {searchParams.get("errorCard") === "false" && searchParams.get("redirect") !== "/" && (
              <Link to={searchParams.get("redirect") || "/"} className="btn btn-light ot-login__back-btn">
                <span className="ot-sidebar__link-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5" />
                    <polyline points="12 19 5 12 12 5" />
                  </svg>
                </span>
                Volver a la página anterior
              </Link>
            )}

            <Link to="/" className="btn btn-light ot-login__back-btn">
              <span className="ot-sidebar__link-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Z" />
                  <polyline points="9 21 9 12 15 12 15 21" />
                </svg>
              </span>
              Volver a la página principal
            </Link>
          </div>
        </Col>
      </Row>
    </div >
  );
}

export default Login;
