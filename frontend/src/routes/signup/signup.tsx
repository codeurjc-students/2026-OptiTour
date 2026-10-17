import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import AccountFieldsCard from '../../components/account-fields-card/account-fields-card';
import PasswordFieldsCard from '../../components/password-fields-card/password-fields-card';
import './signup.css';
import { useState } from 'react';
import { signup, uploadUserImage } from '../../service/user-service';
import { useNavigate } from 'react-router';
import ErrorCard from '../../components/error-card/error-card';
import { useAuthStore } from '../../store/auth-store';
import { FormProvider, useForm } from 'react-hook-form';
import { signupSchema } from '../../schemas/signup-schema';
import type z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

type SignupFormInput = z.input<typeof signupSchema>;
type SignupFormData = z.output<typeof signupSchema>;

export function Signup() {
    const navigate = useNavigate();

    const { doLogin, refreshProfileImage } = useAuthStore();

    const [error, setError] = useState<string | null>(null);
    const [isLoading, setLoading] = useState<boolean>(false);

    const methods = useForm<SignupFormInput, undefined, SignupFormData>({
        resolver: zodResolver(signupSchema),
        mode: "onChange"
    });

    const {
        handleSubmit: handleFormSubmit,
    } = methods;

    async function handleSubmit(data: SignupFormData) {
        try {
            setLoading(true);
            await signup({
                email: data.email,
                phoneNumber: data.phone,
                userName: data.userName,
                password: data.password
            });
            const newUser = await doLogin({ email: data.email, password: data.password });

            if (data.image && data.image.length > 0) {
                const file = data.image[0];
                await uploadUserImage(file, newUser.id);
                refreshProfileImage();
            }

            navigate("/");
        }
        catch (err) {
            err instanceof Error
                ? setError(err.message)
                : "Se ha producido un error durante el registro del usuario";
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <FormProvider {...methods}>
            <Form onSubmit={handleFormSubmit(handleSubmit)} noValidate>
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
        </FormProvider>
    );
}

export default Signup;
