import { Modal, Button } from 'react-bootstrap';
import './feedback-modal.css';

interface FeedbackModalProps {
    show: boolean;
    onHide: () => void;
    title?: string;
    message?: string;
    buttonText?: string;
}

export default function FeedbackModal({
    show,
    onHide,
    title,
    message,
    buttonText = "Entendido"
}: FeedbackModalProps) {
    return (
        <Modal
            show={show}
            onHide={onHide}
            centered
            className="ot-modal"
        >
            {title && (
                <Modal.Header closeButton className="ot-modal__header">
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
