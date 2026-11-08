import { useState } from 'react';
import { Button, Form, Card } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import PasswordInput from '../../components/password-input/password-input';
import './delete-profile.css';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { deleteProfileSchema, type DeleteProfileFormData } from '../../schemas/delete-profile-schema';
import { deleteloggedUser } from '../../service/user-service';
import ErrorCard from '../../components/error-card/error-card';
import { useAuthStore } from '../../store/auth-store';

export function meta() {
    return [
        { title: "Eliminar Cuenta | OptiTour" },
    ];
}

export default function DeleteProfile() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const location = useLocation();
    const { doLogout } = useAuthStore()

    const {
        register,
        handleSubmit: handleFormSubmit,
        formState: { errors, isValid }
    } = useForm<DeleteProfileFormData>({
        resolver: zodResolver(deleteProfileSchema),
        mode: "onChange",
        defaultValues: {
            password: "",
            isConfirmed: false
        }
    });

    const returnPage = location.pathname.startsWith('/admin')
        ? '/admin/profile'
        : '/profile';

    async function handleSubmit(data: DeleteProfileFormData) {
        try {
            setIsLoading(true);
            setError(null);
            await deleteloggedUser({
                password: data.password
            });

            await doLogout();
            navigate("/", {
                state: {
                    showModal: true,
                    modalMessage: "Tu cuenta ha sido eliminada correctamente. ¡Vuelve pronto!",
                    goodbye: true
                }
            });
        }
        catch (err) {
            err instanceof Error
                ? setError(err.message)
                : setError("Se ha producido un error al eliminar la cuenta.");
        }
        finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="ot-delete-profile">
            <div className="ot-delete-profile__header">
                <div className="ot-delete-profile__warning-badge" aria-hidden="true">
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                        <line x1="12" y1="9" x2="12" y2="13" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                </div>
                <h1 className="ot-delete-profile__title">Eliminación de la cuenta</h1>
            </div>

            <Card className="ot-delete-profile__card">
                <div className="ot-delete-profile__alert-box">
                    <div className="ot-delete-profile__alert-heading">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        <span>La siguiente acción es permanente y no se puede deshacer</span>
                    </div>
                    <p className="ot-delete-profile__alert-text">
                        Si estás completamente seguro de que quieres eliminar tu cuenta, escribe tu contraseña actual y marca la casilla de verificación. Se borrará toda tu información y tus tours de forma definitiva.
                    </p>
                </div>

                {error && <ErrorCard text={error} />}

                <Form onSubmit={handleFormSubmit(handleSubmit)} noValidate>
                    <Form.Group className="ot-delete-profile__form-group" controlId="delete-account-password">
                        <Form.Label className="ot-delete-profile__label">Contraseña</Form.Label>
                        <PasswordInput
                            placeholder="Introduce tu contraseña"
                            {...register("password")}
                            isInvalid={!!errors.password}
                        />
                        {errors.password && (
                            <div className="invalid-feedback d-block">
                                {errors.password.message}
                            </div>
                        )}
                    </Form.Group>

                    <div className="ot-delete-profile__checkbox-wrapper">
                        <Form.Check
                            type="checkbox"
                            id="confirm-deletion-checkbox"
                            className="ot-delete-profile__checkbox"
                            {...register("isConfirmed")}
                            isInvalid={!!errors.isConfirmed}
                            label="Confirmo que quiero eliminar mi cuenta permanentemente."
                        />
                        {errors.isConfirmed && (
                            <div className="invalid-feedback d-block mt-2">
                                {errors.isConfirmed.message}
                            </div>
                        )}
                    </div>

                    <div className="ot-delete-profile__actions">
                        <Button
                            type="submit"
                            className="ot-delete-profile__submit-btn"
                            disabled={isLoading || !isValid}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M3 6h18" />
                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                <line x1="10" y1="11" x2="10" y2="17" />
                                <line x1="14" y1="11" x2="14" y2="17" />
                            </svg>
                            {isLoading ? "Eliminando cuenta..." : "Eliminar cuenta permanentemente"}
                        </Button>
                        <Link to={returnPage} className="btn btn-outline-dark ot-delete-profile__cancel-btn">
                            Cancelar
                        </Link>
                    </div>
                </Form>
            </Card>
        </div>
    );
}
