import { Card, Form, Row, Col, Button } from 'react-bootstrap';
import './poi-fields-card.css';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import type { PointOfInterestDTO } from '../../dto/point-of-interest-dto';
import type { ImageDTO } from '../../dto/image-dto';
import { API_BASE_URL } from '../../service/api-config';

export interface PoiFieldsCardProps {
    poi?: PointOfInterestDTO;
}

export type PoiFieldsCard = PoiFieldsCardProps;

export default function PoiFieldsCard({ poi }: PoiFieldsCardProps) {
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [_imagePreviews, setImagesPreviwews] = useState<string[]>([]);
    const [existingImages, setExistingImages] = useState<ImageDTO[]>([]);
    const hasImages = existingImages.length > 0 || selectedImages.length > 0;

    const {
        formState: { errors },
        getFieldState,
        getValues,
        register,
        setValue,
        trigger,
    } = useFormContext();
    const imagesRegistration = register("images");
    register("existingImages");
    register("deletedImageIds");

    function handlePreview(event: React.ChangeEvent<HTMLInputElement>) {
        const files = Array.from(event.target.files ?? []);

        let previews: string[] = [];
        files.forEach(file => {
            previews.push(URL.createObjectURL(file));
        });

        setImagesPreviwews(previews);
        const updatedImages = [...selectedImages, ...files];
        setSelectedImages(updatedImages);
        setValue("images", updatedImages.length > 0 ? updatedImages : undefined, {
            shouldDirty: true,
            shouldValidate: true
        });
    }

    async function handleDeleteImage(deleteIndex: number, isExisting: boolean) {
        if (isExisting) {
            const imageToDelete = existingImages[deleteIndex];

            if (imageToDelete?.id) {
                const currentDeleted = (getValues("deletedImageIds") ?? []) as number[];
                setValue("deletedImageIds", [...currentDeleted, imageToDelete.id], { shouldDirty: true });
            }

            const deletedList = existingImages.filter((_image, index) => index != deleteIndex);
            setExistingImages(deletedList);
            setValue("existingImages", deletedList.length > 0 ? deletedList : undefined, {
                shouldDirty: true,
                shouldValidate: true
            });
            trigger("images");
        }
        else {
            const deletedList = selectedImages.filter((_image, index) => {
                return index != deleteIndex;
            });

            setSelectedImages(deletedList);
            setValue("images", deletedList.length > 0 ? deletedList : undefined, {
                shouldDirty: true,
                shouldValidate: true
            });
        }
    }

    function handleLoadImages() {
        if (poi && poi.images) {
            setExistingImages(poi.images);
            setValue("existingImages", poi.images.length > 0 ? poi.images : undefined, {
                shouldValidate: true
            });
            trigger("images");
        }
    }

    useEffect(() => { handleLoadImages() }, [poi]);

    return (
        <Card className="ot-create-poi__card">
            <Form.Group controlId="poiName" className="ot-create-poi__field">
                <Form.Label>Nombre del punto de interés</Form.Label>
                <Form.Control
                    type="text"
                    {...register("name")}
                    isInvalid={!!errors.name}
                    isValid={getFieldState("name").isDirty && !errors.name}
                    defaultValue={poi?.name}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.name?.message as string}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="ot-create-poi__field">
                <Form.Label>Imágenes</Form.Label>
                <div className="ot-create-poi__images">
                    {!hasImages ? (
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
                            {existingImages.map((image, index) => (
                                <div className="ot-create-poi__image-slot" key={`existing-${image.id}-${index}`}>
                                    <img src={`${API_BASE_URL}/image/${image.id}`} alt={`Imagen existente ${index + 1}`} />
                                    <button
                                        type="button"
                                        className="ot-create-poi__remove-image"
                                        aria-label={`Eliminar imagen existente ${index + 1}`}
                                        onClick={() => { handleDeleteImage(index, true) }}
                                    >
                                        X
                                    </button>
                                </div>
                            ))}

                            {selectedImages.map((image, index) => (
                                <div className="ot-create-poi__image-slot" key={image.name + index}>
                                    <img src={URL.createObjectURL(image)} alt={`Imagen ${index + 1}`} />
                                    <button
                                        type="button"
                                        className="ot-create-poi__remove-image"
                                        aria-label={`Eliminar imagen ${index + 1}`}
                                        onClick={() => { handleDeleteImage(index, false) }}
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
                    {...register("desc")}
                    isInvalid={!!errors.desc}
                    isValid={getFieldState("desc").isDirty && !errors.desc}
                    defaultValue={poi?.description}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.desc?.message as string}
                </Form.Control.Feedback>
            </Form.Group>

            <Row className="g-3 ot-create-poi__field">
                <Col md={6}>
                    <Form.Group controlId="poiCity">
                        <Form.Label>Ciudad</Form.Label>
                        <Form.Control
                            type="text"
                            {...register("city")}
                            isInvalid={!!errors.city}
                            isValid={getFieldState("city").isDirty && !errors.city}
                            defaultValue={poi?.city}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.city?.message as string}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group controlId="poiAddress">
                        <Form.Label>Dirección</Form.Label>
                        <Form.Control
                            type="text"
                            {...register("address")}
                            isInvalid={!!errors.address}
                            isValid={getFieldState("address").isDirty && !errors.address}
                            defaultValue={poi?.address}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.address?.message as string}
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
                            {...register("lat")}
                            isInvalid={!!errors.lat}
                            isValid={getFieldState("lat").isDirty && !errors.lat}
                            defaultValue={(poi as any)?.lat ?? poi?.coords?.split(',')[0]}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.lat?.message as string}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group controlId="poiLng">
                        <Form.Label>Longitud</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Ej. -3.7038"
                            {...register("lng")}
                            isInvalid={!!errors.lng}
                            isValid={getFieldState("lng").isDirty && !errors.lng}
                            defaultValue={(poi as any)?.lng ?? poi?.coords?.split(',')[1]}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.lng?.message as string}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>
        </Card>
    );
}

export { PoiFieldsCard };
