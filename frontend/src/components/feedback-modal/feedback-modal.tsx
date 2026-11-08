import { Modal, Button } from 'react-bootstrap';
import './feedback-modal.css';
import welcomeLogo from '../../assets/welcome-logo.png';
import goodbyeLogo from '../../assets/goodbye-logo.png';

interface FeedbackModalProps {
    show: boolean;
    onHide: () => void;
    title?: string;
    message?: string;
    buttonText?: string;
    welcome?: boolean;
    goodbye?: boolean;
}

export default function FeedbackModal({
    show,
    onHide,
    title,
    message,
    buttonText = "Entendido",
    welcome,
    goodbye
}: FeedbackModalProps) {
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
                <Button className="ot-modal__btn" onClick={onHide}>
                    {buttonText}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
