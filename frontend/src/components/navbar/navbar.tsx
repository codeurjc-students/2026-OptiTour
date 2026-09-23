import { Navbar, Container, Nav } from 'react-bootstrap';
import { Link } from 'react-router';
import logo from '../../assets/OptiTourLogo.png';
import './navbar.css';
import { useAuthStore } from '../../store/auth-store';

function OptiTourNavbar() {

  const { loggedUser } = useAuthStore();
  const { doLogout } = useAuthStore();

  return (
    <Navbar bg="white" expand="md" className="ot-navbar" sticky="top">
      <Container fluid className="ot-navbar__container">
        <Navbar.Brand as={Link} to="/" className="ot-navbar__brand">
          <img src={logo} alt="OptiTour" className="ot-navbar__logo" />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="ot-navbar-nav" />
        <Navbar.Collapse id="ot-navbar-nav" className="justify-content-end">
          <Nav className="ot-navbar__actions">
            {loggedUser ? (
              <div className="d-flex align-items-center gap-3">
                <Link to="/profile/notifications" className="text-dark" title="Notificaciones">
                  <i className="bi bi-bell fs-5"></i>
                </Link>
                <Link
                  to="/profile"
                  className="btn ot-navbar__btn ot-navbar__btn--profile d-flex align-items-center gap-2"
                >
                  <img
                    src="https://via.placeholder.com/24"
                    alt="Foto de perfil"
                    className="rounded-circle object-fit-cover"
                    style={{ width: '24px', height: '24px' }}
                  />
                  <span>Perfil</span>
                </Link>
                {
                  (loggedUser.roles || []).includes("ADMIN") &&
                  <Link
                    to="/admin/profile"
                    className="btn ot-navbar__btn ot-navbar__btn--profile d-flex align-items-center gap-2 adminButton"
                  >
                    <i className="bi bi-shield-lock fs-5"></i>
                    <span>Panel de administración</span>
                  </Link>
                }
                <button
                  onClick={async () => await doLogout()}
                  className="btn btn-outline-danger ot-navbar__btn ot-navbar__btn--outline d-flex align-items-center gap-2"
                >
                  <i className="bi bi-box-arrow-right"></i>
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            ) :
              <>
                <Link
                  to="/signup"
                  className="btn btn-outline-dark ot-navbar__btn ot-navbar__btn--outline"
                >
                  Registrarse
                </Link>
                <Link to="/login" className="btn btn-primary ot-navbar__btn ot-navbar__btn--fill loginButton">
                  Iniciar sesión
                </Link>
              </>
            }
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default OptiTourNavbar;
