import { Modal, Button } from 'react-bootstrap';
import './action-modal.css';
import ErrorCard from '../error-card/error-card';

interface ActionModalProps {
    show: boolean;
    onHide: () => void;
    title?: string;
    message?: string;
    closeButtonText?: string;
    actionButtonText: String
    actionButtonHandler: () => void;
    actionError: string | null
}

export default function FeedbackModal({
    show,
    onHide,
    title,
    message,
    closeButtonText,
    actionButtonText,
    actionButtonHandler,
    actionError
}: ActionModalProps) {
    return (
        <Modal
            show={show}
            onHide={onHide}
            centered
            className="ot-modal"
        >
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
                <Button className="ot-modal__btn ot-modal__nav-btn" onClick={actionButtonHandler}>
                    {actionButtonText}
                </Button>
                <Button className="ot-modal__btn" onClick={onHide}>
                    {closeButtonText ? closeButtonText : "Cerrar"}
                </Button>
                {actionError && <ErrorCard text={actionError} />}
            </Modal.Footer>
        </Modal >
    );
}
