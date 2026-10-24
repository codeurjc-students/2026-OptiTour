import { useAuthStore } from "../../store/auth-store";
import ErrorPage from "../error-page/error-page";

interface AnonymousPageProps {
    children: React.ReactNode;
}

export default function AnonymousPage({ children }: AnonymousPageProps) {
    const { loggedUser } = useAuthStore();

    if (loggedUser) {
        return (
            <ErrorPage errNum={401}
                errTitle="Ya estás autenticado"
                errText="Ya estás identificado en el sistema. Para acceder a esta página, cierra sesión."
                buttonText="Cerrar sesión y acceder"
                logoutButton={true}
            >
            </ErrorPage>);
    }

    return <>{children}</>
}