import { Button, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import ErrorCard from "../error-card/error-card";
import './error-page.css';
import { useAuthStore } from "../../store/auth-store";
import logo from "../../assets/OptiTourLogo.png";

interface errorPageProps {
    errNum: number,
    errTitle: string,
    errText: string,
    loginButton?: boolean
    logoutButton?: boolean
    buttonText?: string,
    buttonURL?: string,
}

export default function ErrorPage({ errNum, errTitle, errText, buttonText, buttonURL, logoutButton, loginButton }: errorPageProps) {
    const { doLogout } = useAuthStore();
    const navigate = useNavigate();

    return (
        <Container className="ot-unauthorized d-flex justify-content-center align-items-center">
            <div className="ot-unauthorized__card rounded-4">
                <div className="ot-unauthorized__card-inner d-flex flex-column flex-md-row align-items-center">
                    
                    {/* Logo a la izquierda */}
                    <div className="ot-unauthorized__logo-pane text-center">
                        <Link to="/" title="Ir al inicio" className="ot-unauthorized__logo-link">
                            <img src={logo} alt="OptiTour Logo" className="ot-unauthorized__logo" />
                        </Link>
                    </div>

                    {/* Separador vertical en desktop / horizontal en móvil */}
                    <div className="ot-unauthorized__divider" aria-hidden="true" />

                    {/* Contenido del error a la derecha */}
                    <div className="ot-unauthorized__content-pane text-center">
                        <h1 className="mb-4">{errNum}: {errTitle}</h1>
                        <ErrorCard text={errText} />

                        <div className="ot-unauthorized__actions d-flex gap-3 justify-content-center flex-wrap">
                            <Button onClick={() => navigate("/")} variant="outline-success" className="ot-unauthorized__btn ot-unauthorized__btn--outline">
                                Volver al inicio
                            </Button>
                            {
                                logoutButton &&
                                <Button onClick={async () => await doLogout()} variant="danger" className="ot-unauthorized__btn ot-unauthorized__btn--danger">
                                    <i className="bi bi-box-arrow-right me-2"></i>
                                    {buttonText}
                                </Button>
                            }
                            {
                                loginButton &&
                                <Button onClick={async () => navigate("/login")} variant="success" className="ot-unauthorized__btn ot-unauthorized__btn--fill">
                                    {buttonText}
                                </Button>
                            }
                            {
                                (buttonText && buttonURL) && <Button onClick={() => navigate(buttonURL)} variant="success" className="ot-unauthorized__btn ot-unauthorized__btn--fill">
                                    {buttonText}
                                </Button>
                            }
                        </div>
                    </div>

                </div>
            </div>
        </Container>
    );
}
