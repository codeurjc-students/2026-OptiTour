import { Card, Form } from 'react-bootstrap';
import './password-fields-card.css';
import { useController, useFormContext } from 'react-hook-form';
import PasswordInput from '../password-input/password-input';

function PasswordFieldsCard() {
    const { control } = useFormContext();
    const passwordField = useController({ name: "password", control });
    const repeatPasswordField = useController({ name: "repeatPassword", control });

    return (
        <Card className="ot-password-fields">
            <Form.Group controlId="password" className="ot-password-fields__field">
                <Form.Label>Contraseña</Form.Label>
                <PasswordInput
                    {...passwordField.field}
                    isInvalid={passwordField.fieldState.invalid}
                    isValid={passwordField.fieldState.isDirty && !passwordField.fieldState.invalid}
                />
                {passwordField.fieldState.error && (
                    <div className="invalid-feedback d-block">
                        {passwordField.fieldState.error.message as string}
                    </div>
                )}
            </Form.Group>

            <Form.Group controlId="passwordRepeat" className="ot-password-fields__field">
                <Form.Label>Repetir contraseña</Form.Label>
                <PasswordInput
                    {...repeatPasswordField.field}
                    isInvalid={repeatPasswordField.fieldState.invalid}
                    isValid={repeatPasswordField.fieldState.isDirty && !repeatPasswordField.fieldState.invalid}
                />
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
