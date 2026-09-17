import { Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router';
import AccountFieldsCard from '../../components/AccountFieldsCard/AccountFieldsCard';
import PasswordFieldsCard from '../../components/PasswordFieldsCard/PasswordFieldsCard';
import './CreateAdminAccount.css';

function CreateAdminAccount() {
    return (
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
    );
}

export default CreateAdminAccount;