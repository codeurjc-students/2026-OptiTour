import { expect, test, vi } from "vitest";
import * as service from '../../src/service/user-service';
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import "@testing-library/jest-dom/vitest";
import DeleteProfile from "../../src/routes/my-profile/delete-profile";
import { loginAs } from "./integration-test-setup";

vi.mock('zustand/middleware', () => ({
    persist: (config: any) => config
}));

const mockStorage = {
    getItem: () => null,
    setItem: () => { },
    removeItem: () => { },
    clear: () => { },
    length: 0,
    key: () => null,
};
Object.defineProperty(globalThis, "localStorage", { value: mockStorage, writable: true });
if (typeof window !== "undefined") {
    Object.defineProperty(window, "localStorage", { value: mockStorage, writable: true });
}

test("Filling form with correct data should delete logged user", async () => {
    // We create a unique user from current date
    const unique = Date.now().toString().slice(-6);
    const tempUser = {
        email: `del_serv_${unique}@example.com`,
        phoneNumber: "111 111 111",
        userName: `user_${unique}`,
        password: "Demo1234"
    };

    await service.signup(tempUser);
    await loginAs(tempUser.email, tempUser.password);

    render(
        <MemoryRouter initialEntries={["/profile/delete"]}>
            <Routes>
                <Route path="/profile/delete" element={<DeleteProfile />} />
                <Route path="/" element={<div>Explora nuestro catálogo de tours</div>} />
            </Routes>
        </MemoryRouter>
    );

    const passwordField = screen.getByLabelText("Contraseña");
    const checkBox = screen.getByRole("checkbox");
    const submitButton = screen.getByRole("button", { name: "Eliminar cuenta permanentemente" });

    fireEvent.change(passwordField, { target: { value: "Demo1234" } });
    fireEvent.click(checkBox);

    // Wait for async validation (Zod) to enable the button before clicking
    await waitFor(() => {
        expect(submitButton).toBeEnabled();
    });

    fireEvent.click(submitButton);

    // Wait for the backend request to finish and navigate to "/"
    expect(await screen.findByText("Explora nuestro catálogo de tours", {}, { timeout: 10000 })).toBeInTheDocument();
}, 20000);

test("Filling form with incorrect pass should delete logged user", async () => {
    // We create a unique user from current date
    const unique = Date.now().toString().slice(-6);
    const tempUser = {
        email: `del_serv_${unique}@example.com`,
        phoneNumber: "111 111 111",
        userName: `user_${unique}`,
        password: "Demo1234"
    };

    await service.signup(tempUser);
    await loginAs(tempUser.email, tempUser.password);

    render(
        <MemoryRouter initialEntries={["/profile/delete"]}>
            <Routes>
                <Route path="/profile/delete" element={<DeleteProfile />} />
                <Route path="/" element={<div>Explora nuestro catálogo de tours</div>} />
            </Routes>
        </MemoryRouter>
    );

    const passwordField = screen.getByLabelText("Contraseña");
    const checkBox = screen.getByRole("checkbox");
    const submitButton = screen.getByRole("button", { name: "Eliminar cuenta permanentemente" });

    fireEvent.change(passwordField, { target: { value: "incorrect" } });
    fireEvent.click(checkBox);

    // Wait for async validation (zod) to enable the button before clicking
    await waitFor(() => {
        expect(submitButton).toBeEnabled();
    });

    fireEvent.click(submitButton);

    const errorCard = await screen.findByText("La contraseña no es correcta.");
    expect(errorCard).toBeInTheDocument();
}, 20000);