import { Card, Form } from 'react-bootstrap';
import './password-fields-card.css';
import { useController, useFormContext } from 'react-hook-form';

function PasswordFieldsCard() {
    const { control } = useFormContext();
    const passwordField = useController({ name: "password", control });
    const repeatPasswordField = useController({ name: "repeatPassword", control });

    function renderEyeButton() {
        return (
            <button type="button" className="ot-password-fields__eye-button" aria-label="Mostrar contraseña">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z" />
                    <line x1="4" y1="20" x2="20" y2="4" />
                </svg>
            </button>
        );
    }

    return (
        <Card className="ot-password-fields">
            <Form.Group controlId="password" className="ot-password-fields__field">
                <Form.Label>Contraseña</Form.Label>
                <div className="ot-password-fields__input-row">
                    <div className="ot-password-fields__input-wrapper">
                        <Form.Control
                            type="password"
                            {...passwordField.field}
                            isInvalid={passwordField.fieldState.invalid}
                            isValid={passwordField.fieldState.isDirty && !passwordField.fieldState.invalid}
                        />
                    </div>
                    {renderEyeButton()}
                </div>
                {passwordField.fieldState.error && (
                    <div className="invalid-feedback d-block">
                        {passwordField.fieldState.error.message as string}
                    </div>
                )}
            </Form.Group>

            <Form.Group controlId="passwordRepeat" className="ot-password-fields__field">
                <Form.Label>Repetir contraseña</Form.Label>
                <div className="ot-password-fields__input-row">
                    <div className="ot-password-fields__input-wrapper">
                        <Form.Control
                            type="password"
                            {...repeatPasswordField.field}
                            isInvalid={repeatPasswordField.fieldState.invalid}
                            isValid={repeatPasswordField.fieldState.isDirty && !repeatPasswordField.fieldState.invalid}
                        />
                    </div>
                    {renderEyeButton()}
                </div>
                {repeatPasswordField.fieldState.error && (
                    <div className="invalid-feedback d-block">
                        {repeatPasswordField.fieldState.error.message as string}
                    </div>
                )}
            </Form.Group>
        </Card>
    );
}

export default PasswordFieldsCard;
