import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import AccountFieldsCard from '../../components/account-fields-card/account-fields-card';
import PasswordFieldsCard from '../../components/password-fields-card/password-fields-card';
import './signup.css';
import { useActionState } from 'react';
import { signup, uploadUserImage } from '../../service/user-service';
import { useNavigate } from 'react-router';
import ErrorCard from '../../components/error-card/error-card';
import { useAuthStore } from '../../store/auth-store';

function Signup() {
    const navigate = useNavigate();

    const { doLogin, refreshProfileImage } = useAuthStore();

    const [{ error }, formAction, isLoading] = useActionState(
        handleSignup,
        { error: null }
    );

    async function handleSignup(_prevState: { error: string | null }, formData: FormData) {
        const email = formData.get("email") as string;
        const phone = formData.get("phone") as string;
        const userName = formData.get("userName") as string;
        const password = formData.get("password") as string;
        const passwordRepeat = formData.get("passwordRepeat") as string;

        let errMessage: string | null = null;

        try {
            if (passwordRepeat == password) {
                await signup({
                    email: email,
                    phoneNumber: phone,
                    userName: userName,
                    password: password
                });
                const newUser = await doLogin({ email: email, password: password });

                const image: File = formData.get("image") as File;

                if (image) {
                    await uploadUserImage(image, newUser.id);
                    refreshProfileImage();
                }
            }
            else
                errMessage = "Las contraseñas no coinciden";
        }
        catch (err) {
            errMessage = err instanceof Error
                ? err.message
                : "Se ha producido un error durante el registro del usuario";
        }

        if (!errMessage)
            navigate("/");

        return { error: errMessage };
    }

    return (
        <Form action={formAction}>
            <div className="ot-register">
                <Container className="ot-register__container">
                    <h1 className="ot-register__title">Registro de usuario</h1>


                    <div className="ot-register__main">
                        <AccountFieldsCard />
                    </div>

                    <Row className="g-4 ot-register__bottom mt-2">
                        <Col md={6}>
                            <PasswordFieldsCard />
                        </Col>

                        <Col md={6}>
                            <Card className="ot-register__card ot-register__card--actions">
                                {error && <ErrorCard text={error} />}
                                <Button type="submit" className="ot-register__submit" disabled={isLoading}>
                                    {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
                                </Button>
                                <p className="ot-register__login-text">O inicia sesión si ya tienes cuenta:</p>
                                <Link to="/login" className="btn btn-outline-dark ot-register__login-btn">
                                    Iniciar sesión
                                </Link>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div >
        </Form>
    );
}

export default Signup;
