import { Modal, Button } from 'react-bootstrap';
import './feedback-modal.css';
import welcomeLogo from '../../assets/welcome-logo.png';
import goodbyeLogo from '../../assets/goodbye-logo.png';
import { useNavigate } from 'react-router-dom';

interface FeedbackModalProps {
    show: boolean;
    onHide: () => void;
    title?: string;
    message?: string;
    buttonText?: string;
    welcome?: boolean;
    goodbye?: boolean;
    navButton?: boolean,
    navButtonText?: string,
    navUrl?: string
}

export default function FeedbackModal({
    show,
    onHide,
    title,
    message,
    buttonText = "Entendido",
    welcome,
    goodbye,
    navButton,
    navButtonText,
    navUrl

}: FeedbackModalProps) {
    const navigate = useNavigate();
    return (
        <Modal
            show={show}
            onHide={onHide}
            centered
            className="ot-modal"
        >
            {welcome && <img src={welcomeLogo} alt="OptiTour" className="ot-modal__logo" />}
            {goodbye && <img src={goodbyeLogo} alt="OptiTour" className="ot-modal__logo" />}
            {title && (
                <Modal.Header className="ot-modal__header">
                    <Modal.Title className="ot-modal__title">{title}</Modal.Title>
                </Modal.Header>
            )}
            {message && (
                <Modal.Body className="ot-modal__body">
                    {message}
                </Modal.Body>
            )}
            <Modal.Footer className="ot-modal__footer">
                {navButton && <Button className="ot-modal__btn ot-modal__nav-btn" onClick={() => { navigate(navUrl!); window.history.replaceState({}, ''); }}>
                    {navButtonText}
                </Button>}
                <Button className="ot-modal__btn" onClick={onHide}>
                    {buttonText}
                </Button>
            </Modal.Footer>
        </Modal >
    );
}
