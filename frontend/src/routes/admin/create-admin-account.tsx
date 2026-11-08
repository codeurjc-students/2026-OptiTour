import { Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import AccountFieldsCard from '../../components/account-fields-card/account-fields-card';
import PasswordFieldsCard from '../../components/password-fields-card/password-fields-card';
import './create-admin-account.css';
import { FormProvider, useForm } from 'react-hook-form';
import type z from 'zod';
import { signupSchema } from '../../schemas/signup-schema';
import { zodResolver } from '@hookform/resolvers/zod';

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

    return (
        <FormProvider {...methods}>
            <div className="ot-create-admin">
                <h1 className="ot-panel-title">Crear nueva cuenta de administración</h1>

                <div className="ot-create-admin__main">
                    <AccountFieldsCard />
                </div>

                <Row className="g-4">
                    <Col md={6}>
                        <PasswordFieldsCard />
                    </Col>

                    <Col md={6}>
                        <div className="ot-create-admin__actions-card">
                            <Button type="submit" className="ot-create-admin__submit">
                                Crear cuenta
                            </Button>
                            <Link to="/admin/users" className="btn btn-outline-dark ot-create-admin__cancel-btn">
                                Cancelar
                            </Link>
                        </div>
                    </Col>
                </Row>
            </div>
        </FormProvider>

    );
}

export default CreateAdminAccount;
