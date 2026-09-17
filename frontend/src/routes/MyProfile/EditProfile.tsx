import { Button } from 'react-bootstrap';
import { Link } from 'react-router';
import AccountFieldsCard from '../../components/AccountFieldsCard/AccountFieldsCard';
import './EditProfile.css';

function EditProfile() {
    return (
        <div className="ot-edit-profile">
            <h1 className="ot-panel-title">Editar información de mi cuenta</h1>

            <AccountFieldsCard />

            <div className="ot-edit-profile__actions">
                <Button type="submit" className="ot-edit-profile__save-btn">
                    Guardar cambios
                </Button>
                <Link to="/profile" className="btn btn-outline-dark ot-edit-profile__cancel-btn">
                    Cancelar
                </Link>
            </div>
        </div>
    );
}

export default EditProfile;