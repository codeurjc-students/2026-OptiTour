import { Outlet } from "react-router";
import AnonymousPage from "../components/anonymous-page/anonymous-page";
import Navbar from "../components/navbar/navbar";
import Footer from "../components/footer/footer";

// Same permission layout as anoymous layout, but with navbar and footer coponents
export default function AnonymousLayout() {
    return (
        <AnonymousPage>
            <Navbar />
            <Outlet />
            <Footer />
        </AnonymousPage>
    );
}