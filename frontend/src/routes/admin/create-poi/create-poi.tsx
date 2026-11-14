import { Card, Form, Row, Col, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import './create-poi.css';
import type z from 'zod';
import { poiSchema } from '../../../schemas/point-of-interest-schema';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { createPoi, uploadPoiUIamges } from '../../../service/point-of-interest-service';
import ErrorCard from '../../../components/error-card/error-card';

export function meta() {
    return [
        { title: "Añadir Punto de Interés | OptiTour" },
    ];
}

type CreatePoiFormInput = z.input<typeof poiSchema>;
type CreatePoiFormData = z.output<typeof poiSchema>;

export default function CreatePointOfInterest() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [_imagePreviews, setImagesPreviwews] = useState<string[]>([])

    const navigate = useNavigate();

    const methods = useForm<CreatePoiFormInput, undefined, CreatePoiFormData>({
        resolver: zodResolver(poiSchema),
        mode: "onChange"
    });

    async function handleSubmit(data: CreatePoiFormData) {
        setIsLoading(true);
        try {
            const response = await createPoi({
                name: data.name,
                description: data.desc,
                city: data.city,
                address: data.address,
                coords: `${data.lat},${data.lng}`
            });

            const imagesToUpload = selectedImages && selectedImages.length > 0
                ? selectedImages
                : (data.images ? Array.from(data.images as FileList | File[]) : []);

            await uploadPoiUIamges(imagesToUpload, response.id);

            navigate("/admin/poi", {
                state: {
                    showModal: true,
                    modalTitle: "Punto de interés creado",
                    modalMessage: `Se ha creado el siguiente punto de interés:\n ${response.name}\n ¿Quieres ver su detalle?`,
                    navButton: true,
                    navButtonText: "Sí, ver detalle",
                    navUrl: `/point-of-interest/${response.id}`,
                    buttonText: "No, volver al panel",
                }
            });
        }
        catch (err) {
            err instanceof Error
                ? setError(err.message)
                : setError("Se ha producido un error durante la creación del punto de interés.")
        }
        finally {
            setIsLoading(false);
        }
    }

    const {
        formState: { isValid, errors },
        handleSubmit: handleFormSubmit,
    } = methods;
    const imagesRegistration = methods.register("images");

    function handlePreview(event: React.ChangeEvent<HTMLInputElement>) {
        const files = Array.from(event.target.files ?? []);

        let previews: string[] = []
        files.forEach(file => {
            previews.push(URL.createObjectURL(file));
        });

        setImagesPreviwews(previews);
        setSelectedImages(previous => [...previous, ...files]);
    }

    function handleDeleteImage(deleteIndex: number) {
        const deletedList = selectedImages.filter((_image, index) => {
            return index != deleteIndex
        });

        setSelectedImages(deletedList);
        methods.setValue("images", deletedList.length > 0 ? deletedList : undefined, {
            shouldDirty: true,
            shouldValidate: true
        });
    }

    return (
        <FormProvider {...methods}>
            <Form onSubmit={handleFormSubmit(handleSubmit)} noValidate>
                <div className="ot-create-poi">
                    <h1 className="ot-panel-title">Añadir punto de interés</h1>

                    <Card className="ot-create-poi__card">
                        <Form.Group controlId="poiName" className="ot-create-poi__field">
                            <Form.Label>Nombre del punto de interés</Form.Label>
                            <Form.Control
                                type="text"
                                {...methods.register("name")}
                                isInvalid={!!errors.name}
                                isValid={methods.getFieldState("name").isDirty && !errors.name}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.name?.message}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="ot-create-poi__field">
                            <Form.Label>Imágenes</Form.Label>
                            <div className="ot-create-poi__images">
                                {selectedImages.length === 0 ? (
                                    <Button
                                        variant="outline-dark"
                                        className="ot-create-poi__upload-btn"
                                        as="label"
                                        htmlFor="upload-image"
                                    >
                                        Subir imágenes
                                    </Button>
                                ) : (
                                    <>
                                        {selectedImages.map((image, index) => (
                                            <div className="ot-create-poi__image-slot" key={image.name + index}>
                                                <img src={URL.createObjectURL(image)} alt={`Imagen ${index + 1}`} />
                                                <button
                                                    type="button"
                                                    className="ot-create-poi__remove-image"
                                                    aria-label={`Eliminar imagen ${index + 1}`}
                                                    onClick={() => { handleDeleteImage(index) }}
                                                >
                                                    X
                                                </button>
                                            </div>
                                        ))}

                                        <Button
                                            variant="outline-dark"
                                            className="ot-create-poi__upload-btn"
                                            as="label"
                                            htmlFor="upload-image"
                                        >
                                            +
                                        </Button>
                                    </>
                                )}
                                <input
                                    {...imagesRegistration}
                                    type="file"
                                    className="d-none"
                                    id="upload-image"
                                    accept=".png, .jpg, .webp"
                                    multiple
                                    onChange={(event) => {
                                        imagesRegistration.onChange(event);
                                        handlePreview(event);
                                    }}
                                />
                            </div>
                            <Form.Control.Feedback type="invalid" className="d-block">
                                {typeof errors.images?.message === "string" ? errors.images.message : null}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId="poiDescription" className="ot-create-poi__field">
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                {...methods.register("desc")}
                                isInvalid={!!errors.desc}
                                isValid={methods.getFieldState("desc").isDirty && !errors.desc}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.desc?.message}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Row className="g-3 ot-create-poi__field">
                            <Col md={6}>
                                <Form.Group controlId="poiCity">
                                    <Form.Label>Ciudad</Form.Label>
                                    <Form.Control
                                        type="text"
                                        {...methods.register("city")}
                                        isInvalid={!!errors.city}
                                        isValid={methods.getFieldState("city").isDirty && !errors.city}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.city?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="poiAddress">
                                    <Form.Label>Dirección</Form.Label>
                                    <Form.Control
                                        type="text"
                                        {...methods.register("address")}
                                        isInvalid={!!errors.address}
                                        isValid={methods.getFieldState("address").isDirty && !errors.address}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.address?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className="g-3 ot-create-poi__field ot-create-poi__field--last">
                            <Col md={6}>
                                <Form.Group controlId="poiLat">
                                    <Form.Label>Latitud</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Ej. 40.4168"
                                        {...methods.register("lat")}
                                        isInvalid={!!errors.lat}
                                        isValid={methods.getFieldState("lat").isDirty && !errors.lat}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.lat?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="poiLng">
                                    <Form.Label>Longitud</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Ej. -3.7038"
                                        {...methods.register("lng")}
                                        isInvalid={!!errors.lng}
                                        isValid={methods.getFieldState("lng").isDirty && !errors.lng}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.lng?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Card>

                    <div className="ot-create-poi__actions">
                        <Button type="submit" className="ot-create-poi__submit" disabled={isLoading || !isValid}>
                            {isLoading ? "Creando punto de interés" : "Crear punto de interés"}
                        </Button>
                        <Link to="/admin/poi" className="btn btn-outline-dark ot-create-poi__cancel-btn">
                            Cancelar
                        </Link>
                    </div>
                </div>
                {error && <ErrorCard text={error} />}
            </Form>
        </FormProvider>
    );
}