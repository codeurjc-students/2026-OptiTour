import { Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import './create-poi.css';
import type z from 'zod';
import { poiSchema } from '../../../schemas/point-of-interest-schema';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { createPoi, uploadPoiUIamges } from '../../../service/point-of-interest-service';
import ErrorCard from '../../../components/error-card/error-card';
import PoiFieldsCard from '../../../components/poi-fields-card/poi-fields-card';

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

    const navigate = useNavigate();

    const methods = useForm<CreatePoiFormInput, undefined, CreatePoiFormData>({
        resolver: zodResolver(poiSchema),
        mode: "onChange"
    });

    async function handleSubmit(data: CreatePoiFormData) {
        if (isLoading) return;
        setIsLoading(true);
        try {
            const response = await createPoi({
                name: data.name,
                description: data.desc,
                city: data.city,
                address: data.address,
                coords: `${data.lat},${data.lng}`
            });

            const imagesToUpload = data.images
                ? Array.from(data.images as FileList | File[])
                : [];

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
            console.error("Error creating POI:", err);
            err instanceof Error
                ? setError(err.message)
                : setError("Se ha producido un error durante la creación del punto de interés.")
        }
        finally {
            setIsLoading(false);
        }
    }

    const {
        handleSubmit: handleFormSubmit,
    } = methods;

    function handleInvalidSubmit(formErrors: any) {
        const errorList = Object.keys(formErrors)
            .map((k) => `${k}: ${formErrors[k]?.message || "inválido"}`)
            .join("; ");
        setError("Error de validación: " + (errorList || "Datos del formulario inválidos"));
    }

    return (
        <FormProvider {...methods}>
            <Form onSubmit={handleFormSubmit(handleSubmit, handleInvalidSubmit)} noValidate>
                <div className="ot-create-poi">
                    <h1 className="ot-panel-title">Añadir punto de interés</h1>

                    <PoiFieldsCard />

                    <div className="ot-create-poi__actions">
                        <Button
                            type="submit"
                            className="ot-create-poi__submit"
                            disabled={isLoading}
                            onClick={handleFormSubmit(handleSubmit, handleInvalidSubmit)}
                        >
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
