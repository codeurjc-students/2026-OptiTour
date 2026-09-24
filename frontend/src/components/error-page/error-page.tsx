import { Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router";
import ErrorCard from "../error-card/error-card";
import './error-page.css';

interface errorPageProps {
    errNum: number,
    errTitle: string,
    errText: string
}

export default function ErrorPage({ errNum, errTitle, errText }: errorPageProps) {
    const navigate = useNavigate();

    return (
        <Container className="ot-unauthorized d-flex flex-column justify-content-center align-items-center">
            <div className="ot-unauthorized__card text-center p-5 rounded-4">
                <h1 className="mb-4">{errNum}: {errTitle}</h1>
                <ErrorCard text={errText} />

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