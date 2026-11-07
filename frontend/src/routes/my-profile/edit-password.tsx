import { Button, Card, Form } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FormProvider, useForm } from 'react-hook-form';
import PasswordFieldsCard from '../../components/password-fields-card/password-fields-card';
import PasswordInput from '../../components/password-input/password-input';
import './edit-password.css';
import { passwordEditSchema } from '../../schemas/password-edit-schema';
import type z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { changePassword } from '../../service/user-service';
import ErrorCard from '../../components/error-card/error-card';

export function meta() {
    return [
        { title: "Cambiar Contraseña | OptiTour" },
    ];
}

type PasswordEditFormInput = z.input<typeof passwordEditSchema>;
type PasswordEditFormData = z.output<typeof passwordEditSchema>;

export default function EditPassword() {
    const location = useLocation();
    const cancelPath = location.pathname.startsWith('/admin')
        ? '/admin/profile'
        : '/profile';

    const methods = useForm<PasswordEditFormInput, undefined, PasswordEditFormData>({
        mode: "onChange",
        resolver: zodResolver(passwordEditSchema)
    });

    const {
        formState: { isValid, errors }
    } = methods;

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    async function handleSubmit(data: any) {
        setIsLoading(true);
        try {
            await changePassword({
                oldPassword: data.oldPassword,
                newPassword: data.password
            });

            navigate("/profile");
        }
        catch (err) {
            err instanceof Error
                ? setError(err.message)
                : setError("Se ha producido un error al cambiar la contraseña. Inténtalo de nuevo más tarde.");
        }
        finally {
            setIsLoading(false);
        }
    };

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(handleSubmit)} noValidate className="ot-edit-password">
                <h1 className="ot-panel-title">Cambiar la contraseña de la cuenta</h1>

                <div className="ot-edit-password__info-box">
                    <div className="ot-edit-password__info-heading">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="10" x2="12" y2="16" />
                            <line x1="12" y1="7" x2="12.01" y2="7" />
                        </svg>
                        <span>Importante</span>
                    </div>
                    <p className="ot-edit-password__info-text">
                        Introduce tu contraseña actual para verificar tu identidad antes de establecer la nueva. Recuerda que debe contener entre 8 y 20 caracteres, incluyendo mayúsculas, minúsculas y números.
                    </p>
                </div>

                <div className="ot-edit-password__section">
                    <h2 className="ot-panel-subtitle">Introduce tu contraseña actual</h2>
                    <Card className="ot-edit-password__card">
                        <Form.Group controlId="oldPassword" className="ot-edit-password__field">
                            <Form.Label>Contraseña actual</Form.Label>
                            <PasswordInput
                                placeholder="Introduce tu contraseña actual"
                                {...methods.register("oldPassword")}
                                isInvalid={!!errors.oldPassword}
                            />
                            {errors.oldPassword && (
                                <div className="invalid-feedback d-block">
                                    {errors.oldPassword.message}
                                </div>
                            )}
                        </Form.Group>
                    </Card>
                </div>

                <div className="ot-edit-password__section">
                    <h2 className="ot-panel-subtitle">Introduce la nueva contraseña</h2>
                    <PasswordFieldsCard />
                </div>

                <div className="ot-edit-password__actions">
                    <Button type="submit" className="ot-edit-password__save-btn" disabled={!isValid || isLoading}>
                        {isLoading ? "Guardando cambios..." : "Guardar cambios"}
                    </Button>
                    <Link to={cancelPath} className="btn btn-outline-dark ot-edit-password__cancel-btn">
                        Cancelar
                    </Link>
                </div>
                {error && <ErrorCard text={error!} />}
            </form>
        </FormProvider>
    );
}
