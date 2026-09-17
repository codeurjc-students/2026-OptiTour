import { Navbar, Container, Nav } from 'react-bootstrap';
import { Link } from 'react-router';
import logo from '../../assets/OptiTourLogo.png';
import './Navbar.css';

function OptiTourNavbar() {
  return (
    <Navbar bg="white" expand="md" className="ot-navbar" sticky="top">
      <Container fluid className="ot-navbar__container">
        <Navbar.Brand as={Link} to="/" className="ot-navbar__brand">
          <img src={logo} alt="OptiTour" className="ot-navbar__logo" />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="ot-navbar-nav" />
        <Navbar.Collapse id="ot-navbar-nav" className="justify-content-end">
          <Nav className="ot-navbar__actions">
            <Link
              to="/signup"
              className="btn btn-outline-dark ot-navbar__btn ot-navbar__btn--outline"
            >
              Registrarse
            </Link>
            <Link to="/login" className="btn btn-primary ot-navbar__btn ot-navbar__btn--fill">
              Iniciar sesión
            </Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default OptiTourNavbar;
