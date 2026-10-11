import { Card, Row, Col, Form, Button } from 'react-bootstrap';
import './account-fields-card.css';
import { useEffect, useState } from 'react';

function AccountFieldsCard() {
    const [_image, setImage] = useState<File | null>(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

    function handlePreview(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];

        if (!file) {
            setImage(null);
            setImagePreviewUrl(null);
            return;
        }

        setImage(file);
        setImagePreviewUrl(URL.createObjectURL(file));
    }

    useEffect(() => {
        return () => {
            if (imagePreviewUrl)
                URL.revokeObjectURL(imagePreviewUrl);
        }
    }, [imagePreviewUrl]);

    return (
        <Card className="ot-account-fields">
            <Row className="g-4">
                <Col md={4} className="ot-account-fields__avatar-col">
                    <div className="ot-account-fields__avatar">
                        {imagePreviewUrl ? (
                            <img src={imagePreviewUrl} alt="Foto de perfil" />
                        ) : (
                            <span>Imagen<br />de perfil</span>
                        )}
                    </div>
                    <Button variant="outline-dark" className="ot-account-fields__upload-btn" as="label" htmlFor="upload-image">
                        Subir archivo
                    </Button>
                    <input type="file" className="d-none" id="upload-image" name="image" accept=".png, .jpg, .webp" onChange={handlePreview} />
                </Col>

                <Col md={8}>
                    <Row className="g-3">
                        <Col sm={6}>
                            <Form.Group controlId="email">
                                <Form.Label>Correo electrónico</Form.Label>
                                <Form.Control type="email" name="email" required />
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            <Form.Group controlId="phone">
                                <Form.Label>Número de teléfono</Form.Label>
                                <Form.Control type="tel" name="phone" required />
                            </Form.Group>
                        </Col>
                        <Col xs={12}>
                            <Form.Group controlId="username">
                                <Form.Label>Nombre de usuario</Form.Label>
                                <Form.Control type="text" name="userName" required />
                            </Form.Group>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Card>
    );
}

export default AccountFieldsCard;
