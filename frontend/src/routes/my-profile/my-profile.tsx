import { Button } from 'react-bootstrap';
import FeedbackModal from '../../components/feedback-modal/feedback-modal';
import { Link, useLocation } from 'react-router-dom';
import './my-profile.css';
import { useAuthStore } from '../../store/auth-store';
import Profile from '../../components/profile/profile';
import { useState } from 'react';

export function meta() {
    return [
        { title: "Mi Perfil | OptiTour" },
    ];
}

function MyProfile() {
    const { loggedUser } = useAuthStore();
    const location = useLocation();

    const editPath = location.pathname.startsWith('/admin')
        ? '/admin/profile/edit'
        : '/profile/edit';

    const deletePath = location.pathname.startsWith('/admin')
        ? '/admin/profile/delete'
        : '/profile/delete';

    const editPassPath = location.pathname.startsWith('/admin')
        ? '/admin/profile/edit/password'
        : '/profile/edit/password';

    const [showModal, setShowModal] = useState<boolean>(location.state?.showModal);

    function handleModalClose() {
        setShowModal(false);
        window.history.replaceState({}, '');
    }

    if (!loggedUser) {
        return null;
    }

    return (
        <div className="ot-my-profile">
            <h1 className="ot-panel-title text-center">Mi perfil</h1>

            <FeedbackModal
                show={showModal}
                onHide={handleModalClose}
                title={location.state?.modalTitle}
                message={location.state?.modalMessage}
            />

            <Profile user={loggedUser} />

            <div className="ot-my-profile__actions">
                <Button variant="outline-dark" className="ot-my-profile__edit-btn" as={Link as any} to={editPath}>
                    Editar información de mi cuenta
                </Button>
                <Button variant="outline-dark" className="ot-my-profile__password-btn" as={Link as any} to={editPassPath}>
                    Cambiar mi contraseña
                </Button>
                <Button variant="outline-danger" className="ot-my-profile__delete-btn" as={Link as any} to={deletePath}>
                    Eliminar mi cuenta
                </Button>
            </div>
        </div>
    );
}

export default MyProfile;
