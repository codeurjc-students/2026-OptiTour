import { Form } from 'react-bootstrap';
import './password-input.css';
import { useState } from 'react';

export default function PasswordInput(props: any) {
    const [isVisible, setIsVisible] = useState<boolean>(false);

    function handleViewButton() {
        setIsVisible(!isVisible);
    }

    return (
        <div className="ot-password-input-row">
            <div className="ot-password-input-wrapper">
                <Form.Control type={isVisible ? "text" : "password"} {...props} />
            </div>
            <button type="button" onClick={handleViewButton} className="ot-password-input__eye-button" aria-label="Mostrar contraseña">
                {
                    isVisible ?
                        <>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z" />
                                <line x1="4" y1="20" x2="20" y2="4" />
                            </svg>
                        </>
                        :
                        <>
                            < svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z" />
                                <circle cx="12" cy="12" r="3" />
                            </svg>
                        </>
                }
            </button>
        </div >
    );
}
