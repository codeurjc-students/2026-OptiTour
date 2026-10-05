import { Button } from 'react-bootstrap';
import './my-profile.css';
import { useAuthStore } from '../../store/auth-store';
import ProfileImage from '../../components/profile-image/profile-image';

function MyProfile() {
    const { loggedUser } = useAuthStore();

    if (!loggedUser) {
        return null;
    }

    return (
        <div className="ot-my-profile">
            <h1 className="ot-panel-title text-center">Mi perfil</h1>

            <ProfileImage />

            <h2 className="ot-my-profile__name">{loggedUser!.userName}</h2>

            <dl className="ot-my-profile__data">
                <div>
                    <dt>Correo electrónico</dt>
                    <dd>{loggedUser!.email}</dd>
                </div>
                <div>
                    <dt>Número de teléfono</dt>
                    <dd>{loggedUser!.phoneNumber}</dd>
                </div>
            </dl>

            <div className="ot-my-profile__actions">
                <Button variant="outline-dark" className="ot-my-profile__edit-btn">
                    Editar información de mi cuenta
                </Button>
                <Button variant="outline-dark" className="ot-my-profile__password-btn">
                    Cambiar mi contraseña
                </Button>
                <Button variant="outline-danger" className="ot-my-profile__delete-btn">
                    Eliminar mi cuenta
                </Button>
            </div>
        </div>
    );
}

export default MyProfile;
