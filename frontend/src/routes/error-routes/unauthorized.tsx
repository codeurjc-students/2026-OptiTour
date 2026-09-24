import ErrorPage from "../../components/error-page/error-page";

export default function Unauthorized() {
    return (
        <ErrorPage errNum={403} errTitle="Acceso denegado" errText="No tienes permisos suficientes para acceder a esta página." />
    )
}