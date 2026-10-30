import { useEffect, useRef } from "react";
import { useAuthStore } from "../../store/auth-store";
import ErrorPage from "../error-page/error-page";

interface AnonymousPageProps {
    children: React.ReactNode;
}

export default function AnonymousPage({ children }: AnonymousPageProps) {
    const { loggedUser } = useAuthStore();

    const wasLoggedInOnMount = useRef(!!loggedUser);

    useEffect(() => {
        if (!loggedUser) {
            wasLoggedInOnMount.current = false;
        }
    }, [loggedUser]);

    if (wasLoggedInOnMount.current && loggedUser) {
        return (
            <ErrorPage
                errNum={401}
                errTitle="Ya estás autenticado"
                errText="Ya estás identificado en el sistema. Para acceder a esta página, cierra sesión."
                buttonText="Cerrar sesión y acceder"
                logoutButton={true}
            />
        );
    }

    return <>{children}</>;
}
