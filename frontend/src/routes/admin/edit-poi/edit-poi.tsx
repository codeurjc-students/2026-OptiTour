import type z from "zod";
import PoiFieldsCard from "../../../components/poi-fields-card/poi-fields-card";
import { poiSchema } from "../../../schemas/point-of-interest-schema";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import '../create-poi/create-poi.css';
import type { PointOfInterestCreateDTO } from "../../../dto/point-of-interest-create-dto";
import { getPoiById } from "../../../service/point-of-interest-service";
import { ApiError } from "../../../service/api-error";
import Spinner from "../../../components/spinner/spinner";
import ErrorCard from "../../../components/error-card/error-card";


type CreatePoiFormInput = z.input<typeof poiSchema>;
type CreatePoiFormData = z.output<typeof poiSchema>;

export default function POIEdition() {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>();
    const [poi, setPoi] = useState<PointOfInterestCreateDTO>();
    const { id } = useParams();

    async function handleSubmit() {

    }

    const methods = useForm<CreatePoiFormInput, undefined, CreatePoiFormData>({
        resolver: zodResolver(poiSchema),
        mode: "onChange"
    });

    function handleInvalidSubmit(formErrors: any) {
        const errorList = Object.keys(formErrors)
            .map((k) => `${k}: ${formErrors[k]?.message || "inválido"}`)
            .join("; ");
        setError("Error de validación: " + (errorList || "Datos del formulario inválidos"));
    }

    const {
        handleSubmit: handleFormSubmit,
    } = methods;

    async function handleLoadPoi() {
        setIsLoading(true);
        try {
            const response = await getPoiById(parseInt(id!));
            setPoi(response);
            methods.reset({
                name: response.name,
                desc: response.description,
                city: response.city,
                address: response.address,
                lat: response.coords ? response.coords.split(",")[0] : "",
                lng: response.coords ? response.coords.split(",")[1] : "",
            });
        }
        catch (err) {
            err instanceof ApiError
                ? setError(err.message)
                : setError("Se ha producido un error al cargar el punto de interés a editar.");
        }
        finally {
            setIsLoading(false);
        }
    }

    useEffect(() => { handleLoadPoi() }, []);

    if (isLoading || !poi) {
        return <Spinner />;
    }

    return (
        <>
            <FormProvider {...methods}>
                {error && <ErrorCard text={error} />}
                <PoiFieldsCard poi={poi!} />
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

            </FormProvider>
        </>
    );
}
