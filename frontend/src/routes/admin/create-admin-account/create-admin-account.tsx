import { Button, Row, Col, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import AccountFieldsCard from '../../../components/account-fields-card/account-fields-card';
import PasswordFieldsCard from '../../../components/password-fields-card/password-fields-card';
import './create-admin-account.css';
import { FormProvider, useForm } from 'react-hook-form';
import type z from 'zod';
import { signupSchema } from '../../../schemas/signup-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { createAdminAccount, uploadUserImage } from '../../../service/user-service';
import ErrorCard from '../../../components/error-card/error-card';
import { useAuthStore } from '../../../store/auth-store';

export function meta() {
    return [
        { title: "Crear Administrador | OptiTour" },
    ];
}

type SignupFormInput = z.input<typeof signupSchema>;
type SignupFormData = z.output<typeof signupSchema>;

function CreateAdminAccount() {
    const methods = useForm<SignupFormInput, undefined, SignupFormData>({
        resolver: zodResolver(signupSchema),
        mode: "onChange"
    });

    const {
        formState: { isValid },
        handleSubmit: handleFormSubmit,
    } = methods;

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { refreshProfileImage } = useAuthStore();

    async function handleSubmit(data: SignupFormData) {
        setIsLoading(true);
        try {
            const response = await createAdminAccount({
                email: data.email,
                phoneNumber: data.phone,
                userName: data.userName,
                password: data.password,
            });

            if (data.image && data.image.length > 0) {
                const file = data.image[0];
                await uploadUserImage(file, response.id);
                refreshProfileImage();
            }

            navigate(`/admin/users/${response.id}`, {
                state: {
                    showModal: true,
                    modalTitle: "Nueva cuenta de administración creada",
                    modalMessage: `Se ha creado correctamente la siguiente cuenta de administrador: ${data.userName}`
                }
            });
        }
        catch (err) {
            err instanceof Error
                ? setError(err.message)
                : setError("Se ha producido un error durante la creación de la cuenta de administración.")
        }
        finally {
            setIsLoading(false);
        }
    }

    return (
        <FormProvider {...methods}>
            <Form onSubmit={handleFormSubmit(handleSubmit)} noValidate>
                <div className="ot-create-admin">
                    <h1 className="ot-panel-title">Crear nueva cuenta de administración</h1>

                    {error && <ErrorCard text={error} />}

                    <div className="ot-create-admin__main">
                        <AccountFieldsCard />
                    </div>

                    <Row className="g-4">
                        <Col md={6}>
                            <PasswordFieldsCard />
                        </Col>

                        <Col md={6}>
                            <div className="ot-create-admin__actions-card">
                                <Button type="submit" className="ot-create-admin__submit" disabled={!isValid}>
                                    {isLoading ? "Creando cuenta..." : "Crear cuenta de administración"}
                                </Button>
                                <Link to="/admin/users" className="btn btn-outline-dark ot-create-admin__cancel-btn">
                                    Cancelar
                                </Link>
                            </div>
                        </Col>
                    </Row>
                </div>
            </Form>
        </FormProvider>
    );
}

export default CreateAdminAccount;
