import { Navigate, Outlet, useLocation } from "react-router";
import { useAuthStore } from "../store/auth-store";
import type { ReactNode } from "react";


interface ProtectedRouteProps {
    allowedRoles?: string[];
    children?: ReactNode;
}

export default function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
    const { loggedUser } = useAuthStore();
    const location = useLocation()

    // If there's no logged, we redirect to login page.
    if (!loggedUser) {
        return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
    }

    // If user has not neccessary roles, we redirect to unauthorized error page
    if (allowedRoles && allowedRoles.length > 0) {
        const userRoles = loggedUser.roles || [];
        const hasRole = userRoles.some(role => allowedRoles.includes(role));
        if (!hasRole) {
            return <Navigate to="/unauthorized" replace />;
        }
    }

    // Return children if they were provided
    return children ? <>{children}</> : <Outlet />;
}
