import { Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router";
import ErrorCard from "../../components/error-card/error-card";
import './unauthorized.css';

interface unauthorizedProps {
    page?: string
}

export default function Unauthorized({ page }: unauthorizedProps) {
    const navigate = useNavigate();

    return (
        <Container className="ot-unauthorized d-flex flex-column justify-content-center align-items-center">
            <div className="ot-unauthorized__card text-center p-5 rounded-4">
                <h1 className="mb-4">403: Acceso Denegado</h1>
                <ErrorCard text={`No tienes permisos suficientes para acceder a ${page || 'esta página'}.`} />

                <div className="ot-unauthorized__actions d-flex gap-3 justify-content-center flex-wrap">
                    <Button onClick={() => navigate("/")} variant="outline-success" className="ot-unauthorized__btn ot-unauthorized__btn--outline">
                        Volver al inicio
                    </Button>
                    <Button onClick={() => navigate("/profile")} variant="success" className="ot-unauthorized__btn ot-unauthorized__btn--fill">
                        Ir a mi perfil
                    </Button>
                </div>
            </div>
        </Container>
    );
}