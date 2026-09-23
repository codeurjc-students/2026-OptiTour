import { Outlet } from "react-router";
import Navbar from "../components/navbar/navbar";
import ProtectedRoute from "../routes/protected-route";
import Footer from "../components/footer/footer";

// This layout is for protected pages with navbar and footer. 
// It's only the same layout defined in home.tsx but with the ProtectedRoute wrap component
export default function protectedLayout() {
    return (
        <ProtectedRoute allowedRoles={["USER", "ADMIN"]}>
            <Navbar />
            <Outlet />
            <Footer />
        </ProtectedRoute>
    )
}