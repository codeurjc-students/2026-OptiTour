import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router';
import logo from '../../assets/OptiTourLogo.png';
import './footer.css';
import { useAuthStore } from '../../store/auth-store';

function Footer() {

  const { loggedUser } = useAuthStore();
  const { doLogout } = useAuthStore();


  return (
    <footer className="ot-footer">
      <Container className="ot-footer__container">
        <Row className="ot-footer__top">
          <Col xs={12} md={4} className="ot-footer__brand">
            <img src={logo} alt="OptiTour" className="ot-footer__logo" />
            <p className="ot-footer__tagline">
              Rutas turísticas optimizadas para aprovechar cada minuto de tu viaje.
            </p>
          </Col>

          <Col xs={6} md={4} className="ot-footer__col">
            <h6 className="ot-footer__heading">OptiTour</h6>
            <ul className="ot-footer__list">
              <li>
                <a
                  href="https://github.com/codeurjc-students/2026-OptiTour"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Sobre nosotros en GitHub"
                >
                  <i className="bi bi-github" aria-hidden="true" />Sobre nosotros
                </a>
              </li>
            </ul>
          </Col>

          <Col xs={6} md={4} className="ot-footer__col">
            {
              loggedUser ? <h6 className="ot-footer__heading">Tu cuenta</h6> : <h6 className="ot-footer__heading">Accede</h6>
            }
            <ul className="ot-footer__list">
              {loggedUser ?
                <>
                  <li>
                    <Link to="/" onClick={async () => await doLogout()}>
                      <i className="bi bi-box-arrow-right"></i>Cerrar sesión
                    </Link>
                  </li>
                  <li><Link to="/login"><i className="bi bi-person-circle"></i>Mi perfil</Link></li>
                  <li><Link to="/profile/notifications"><i className="bi bi-bell fs-7"></i>Notificaciones</Link></li>
                </>

                :
                <li><Link to="/login"><i className="bi bi-box-arrow-in-right" aria-hidden="true" />Iniciar sesión</Link></li>
              }

            </ul>
          </Col>
        </Row>

        <hr className="ot-footer__divider" />

        <Row className="ot-footer__bottom">
          <Col>
            <span>© {new Date().getFullYear()} OptiTour. Todos los derechos reservados.</span>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
