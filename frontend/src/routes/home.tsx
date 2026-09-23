import { Outlet } from "react-router";
import Navbar from "../components/navbar/navbar";
import Footer from "../components/footer/footer";

export default function Home() {
    return (
        <>
            <Navbar />
            <Outlet />
            <Footer />
        </>
    );
}