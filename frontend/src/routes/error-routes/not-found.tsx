import ErrorPage from "../../components/error-page/error-page";

export function meta() {
    return [
        { title: "Página No Encontrada | OptiTour" },
    ];
}

export default function NotFound() {
    return (
        <ErrorPage errNum={404} errTitle="Página no encontrada" errText="La página solicitada no existe." />
    );
}
