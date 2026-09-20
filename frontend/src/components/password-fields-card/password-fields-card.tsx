import { Card, Form } from 'react-bootstrap';
import './password-fields-card.css';

const eyeIcon = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z" />
        <line x1="4" y1="20" x2="20" y2="4" />
    </svg>
);

function PasswordFieldsCard() {
    return (
        <Card className="ot-password-fields">
            <Form.Group controlId="accountPassword" className="ot-password-fields__field">
                <Form.Label>Contraseña</Form.Label>
                <div className="ot-password-fields__input-icon">
                    <Form.Control type="password" />
                    {eyeIcon}
                </div>
            </Form.Group>

            <Form.Group controlId="accountPasswordRepeat" className="ot-password-fields__field">
                <Form.Label>Repetir contraseña</Form.Label>
                <div className="ot-password-fields__input-icon">
                    <Form.Control type="password" />
                    {eyeIcon}
                </div>
            </Form.Group>
        </Card>
    );
}

export default PasswordFieldsCard;
