import { useEffect, type ReactNode } from "react";
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./styles/variables.css";
import { useAuthStore } from "./store/auth-store";

export function Layout({ children }: { children: ReactNode }) {
    return (
        <html lang="es">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" type="image/png" href="/assets/favicon.png" />
                <Meta />
                <Links />
            </head>
            <body>
                {children}
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}

export default function Root() {
    const { getLogged } = useAuthStore();

    useEffect(() => {
        getLogged();
    }, [getLogged]);

    return <Outlet />;
}
