import ErrorPage from "../../components/error-page/error-page";

export function meta() {
    return [
        { title: "Acceso Denegado | OptiTour" },
    ];
}

export default function Unauthorized() {
    return (
        <ErrorPage
            errNum={403}
            errTitle="Acceso denegado"
            errText="No tienes permisos suficientes para acceder a esta página."
            buttonText="Ir a mi perfil"
            buttonURL="/profile"
        />
    );
}
