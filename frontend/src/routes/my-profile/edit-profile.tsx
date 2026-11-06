import { Button } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FormProvider, useForm } from 'react-hook-form';
import AccountFieldsCard from '../../components/account-fields-card/account-fields-card';
import './edit-profile.css';
import { useAuthStore } from '../../store/auth-store';
import { zodResolver } from '@hookform/resolvers/zod';
import { editProfileSchema } from '../../schemas/edit-schema';
import type z from 'zod';
import { useEffect, useState } from 'react';
import { editLoggedUser, uploadUserImage } from '../../service/user-service';
import ErrorCard from '../../components/error-card/error-card';

export function meta() {
    return [
        { title: "Editar Información de Cuenta | OptiTour" },
    ];
}

type EditProfileFormInput = z.input<typeof editProfileSchema>;
type EditProfileFormData = z.output<typeof editProfileSchema>;

function EditProfile() {
    const { loggedUser, setLoggedUser, refreshProfileImage } = useAuthStore();
    const navigate = useNavigate();

    const methods = useForm<EditProfileFormInput, undefined, EditProfileFormData>({
        resolver: zodResolver(editProfileSchema),
        mode: "onChange",
        defaultValues: {
            email: loggedUser?.email ?? "",
            phone: loggedUser?.phoneNumber ?? "",
            userName: loggedUser?.userName ?? "",
            image: undefined,
        },
    });

    useEffect(() => {
        if (loggedUser) {
            methods.reset({
                email: loggedUser.email,
                phone: loggedUser.phoneNumber ?? "",
                userName: loggedUser.userName,
                image: undefined,
            });
        }
    }, [loggedUser, methods]);

    const {
        formState: { isValid }
    } = methods;

    const location = useLocation();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(data: EditProfileFormData) {
        setIsLoading(true);
        try {
            const updatedUser = await editLoggedUser({
                email: data.email,
                phoneNumber: data.phone,
                userName: data.userName
            });

            if (data.image && data.image.length > 0) {
                const file = data.image[0];
                await uploadUserImage(file, updatedUser.id);
                refreshProfileImage();
            }

            setLoggedUser(updatedUser);
            navigate("/profile");
        }
        catch (err) {
            err instanceof Error
                ? setError(err.message)
                : setError("Se ha producido un error al editar la cuenta de usuario.");
        }
        finally {
            setIsLoading(false);
        }
    }

    const cancelPath = location.pathname.startsWith('/admin')
        ? '/admin/profile'
        : '/profile';
    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(handleSubmit)} noValidate>
                <div className="ot-edit-profile">
                    <h1 className="ot-panel-title">Editar información de mi cuenta</h1>

                    <div className="ot-edit-profile__info-box">
                        <div className="ot-edit-profile__info-heading">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="10" x2="12" y2="16" />
                                <line x1="12" y1="7" x2="12.01" y2="7" />
                            </svg>
                            <span>Importante</span>
                        </div>
                        <p className="ot-edit-profile__info-text">
                            Aquí puedes editar tu información personal y foto de perfil. Ten en cuenta que no puedes cambiar tu usuario y correo por otro que ya esté siendo utilizado por otro usuario.
                        </p>
                    </div>

                    <AccountFieldsCard loggedUser={loggedUser!} />

                    <div className="ot-edit-profile__actions">
                        <Button type="submit" className="ot-edit-profile__save-btn" disabled={!isValid}>
                            {isLoading ? "Guardando cambios..." : "Guardar cambios"}
                        </Button>
                        <Link to={cancelPath} className="btn btn-outline-dark ot-edit-profile__cancel-btn">
                            Cancelar
                        </Link>
                    </div>
                    {error && (
                        <div className="ot-edit-profile__error">
                            <ErrorCard text={error} />
                        </div>
                    )}
                </div>
            </form>
        </FormProvider>
    );
}

export default EditProfile;
