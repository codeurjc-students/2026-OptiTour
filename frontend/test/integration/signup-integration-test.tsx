import { beforeEach, expect, test, vi } from "vitest";
import * as service from "../../src/service/user-service";
import Signup from "../../src/routes/signup/signup";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

vi.mock("../../src/service/user-service");
const { navigate } = vi.hoisted(() => ({ navigate: vi.fn() }));

vi.mock("react-router", async () => {
    const actual = await vi.importActual<typeof import("react-router")>("react-router");
    return { ...actual, useNavigate: () => navigate };
});

vi.mock("../../src/store/auth-store", () => {
    const doLogin = vi.fn().mockResolvedValue({
        id: 10,
        email: "example@example.com",
        userName: "test",
        phoneNumber: "123",
        roles: ["USER"]
    });
    const refreshProfileImage = vi.fn();
    const useAuthStore = Object.assign(
        vi.fn(() => ({ doLogin, refreshProfileImage })),
        { doLogin, refreshProfileImage }
    );
    return { useAuthStore };
});

beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(service.signup).mockResolvedValue({ id: 10 });
});

test("Correct register", async () => {
    render(
        <MemoryRouter initialEntries={["/signup"]}>
            <Routes>
                <Route path="/signup" element={<Signup />} />
                <Route path="/" element={<div>Inicio</div>} />
            </Routes>
        </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText("Correo electrónico"), {
        target: { value: "example@example.com" }
    });
    fireEvent.change(screen.getByLabelText("Número de teléfono"), {
        target: { value: "123" }
    });
    fireEvent.change(screen.getByLabelText("Nombre de usuario"), {
        target: { value: "tester" }
    });
    fireEvent.change(screen.getByLabelText("Contraseña"), {
        target: { value: "Demo1234" }
    });
    fireEvent.change(screen.getByLabelText("Repetir contraseña"), {
        target: { value: "Demo1234" }
    });

    await act(async () => {
        fireEvent.click(screen.getByRole("button", { name: "Crear Cuenta" }));
    });

    await vi.waitFor(() => expect(navigate).toHaveBeenCalledWith("/"));
});
