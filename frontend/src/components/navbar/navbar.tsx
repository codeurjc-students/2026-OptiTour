import { Navbar, Container, Nav, Dropdown } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/OptiTourLogo.png';
import './navbar.css';
import { useAuthStore } from '../../store/auth-store';
import ProfileImage from '../profile-image/profile-image';

function OptiTourNavbar() {

  const { loggedUser } = useAuthStore();
  const { doLogout } = useAuthStore();

  const location = useLocation();

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

                <Dropdown align="end">
                  <Dropdown.Toggle 
                    variant="link"
                    id="dropdown-profile" 
                    className="ot-navbar__btn ot-navbar__btn--profile d-flex align-items-center gap-2 text-decoration-none"
                  >
                    <span>Página personal</span>
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="shadow-sm border-0 mt-2">
                    <Dropdown.Item as={Link} to="/profile">
                      <i className="bi bi-person me-2"></i> Mi perfil
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/profile/friends">
                      <i className="bi bi-people me-2"></i> Lista de amigos
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/profile/groups">
                      <i className="bi bi-collection me-2"></i> Mis grupos
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/profile/tours">
                      <i className="bi bi-compass me-2"></i> Mis tours
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/profile/payments">
                      <i className="bi bi-credit-card me-2"></i> Mis pagos
                    </Dropdown.Item>

                    {
                      (loggedUser.roles || []).includes("ADMIN") &&
                      <>
                        <Dropdown.Divider />
                        <Dropdown.Item as={Link} to="/admin/profile" className="text-primary fw-bold">
                          <i className="bi bi-shield-lock me-2"></i> Panel de administración
                        </Dropdown.Item>
                      </>
                    }

                    <Dropdown.Divider />
                    <Dropdown.Item onClick={async () => await doLogout()} className="text-danger">
                      <i className="bi bi-box-arrow-right me-2"></i> Cerrar Sesión
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                <ProfileImage className="ot-navbar__avatar" />
              </div>
            ) :
              <>
                <Link
                  to="/signup"
                  className="btn btn-outline-dark ot-navbar__btn ot-navbar__btn--outline"
                >
                  Registrarse
                </Link>
                <Link to={`/login?redirect=${encodeURIComponent(location.pathname)}&errorCard=false`} className="btn btn-primary ot-navbar__btn ot-navbar__btn--fill loginButton">
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
