import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router';
import logo from '../../assets/OptiTourLogo.png';
import './footer.css';

function Footer() {
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
            <h6 className="ot-footer__heading">Explorar</h6>
            <ul className="ot-footer__list">
              <li><Link to="/"><i className="bi bi-compass" aria-hidden="true" />Tours destacados</Link></li>
              <li><Link to="/tours"><i className="bi bi-map" aria-hidden="true" />Todos los tours</Link></li>
              <li><Link to="/como-funciona"><i className="bi bi-question-circle" aria-hidden="true" />Cómo funciona</Link></li>
            </ul>
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
              <li><Link to="/contacto"><i className="bi bi-envelope" aria-hidden="true" />Contacto</Link></li>
              <li><Link to="/login"><i className="bi bi-box-arrow-in-right" aria-hidden="true" />Iniciar sesión</Link></li>
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
