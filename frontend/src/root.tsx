import { useEffect, type ReactNode } from "react";
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./styles/variables.css";
import { useAuthStore } from "./store/auth-store";
import logo from "./assets/OptiTourLogo.png";

export function meta() {
    return [
        { title: "OptiTour" },
    ];
}

export function HydrateFallback() {
    return (
        <div className="d-flex flex-column justify-content-center align-items-center vh-100" style={{ backgroundColor: "var(--ot-bg-soft)" }}>
            <img
                src={logo}
                alt="OptiTour"
                style={{ width: "170px", height: "auto", marginBottom: "1.75rem", userSelect: "none" }}
            />
            <div className="spinner-border" style={{ color: "var(--ot-primary)", width: "2.5rem", height: "2.5rem" }} role="status">
                <span className="visually-hidden">Cargando...</span>
            </div>
        </div>
    );
}

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
