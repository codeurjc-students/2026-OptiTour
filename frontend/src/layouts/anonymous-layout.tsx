import { Outlet } from "react-router";
import AnonymousPage from "../components/anonymous-page/anonymous-page";

export default function AnonymousLayout() {
    return (
        <AnonymousPage>
            <Outlet />
        </AnonymousPage>
    );
}