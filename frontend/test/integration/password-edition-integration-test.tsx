import { expect, test, vi } from "vitest";
import * as service from '../../src/service/user-service';
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import "@testing-library/jest-dom/vitest";
import EditPassword from "../../src/routes/my-profile/edit-password";
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

test('Checks if password edition is correct', async () => {
    const unique = Date.now().toString().slice(-6);
    const tempUser = {
        email: `pass_serv_${unique}@example.com`,
        phoneNumber: "111 111 111",
        userName: `user_${unique}`,
        password: "Demo1234"
    };

    await service.signup(tempUser);
    await loginAs(tempUser.email, tempUser.password);

    render(
        <MemoryRouter initialEntries={["/profile/edit/password"]}>
            <Routes>
                <Route path="/profile/edit/password" element={<EditPassword />} />
                <Route path="/profile" element={<h1>Mi perfil</h1>} />
            </Routes>
        </MemoryRouter>
    );

    const oldPasswordField = await screen.findByLabelText("Contraseña actual");
    const newPasswordField = await screen.findByLabelText("Contraseña");
    const repeatPasswordField = await screen.findByLabelText("Repetir contraseña");
    const submitButton = screen.getByRole("button", { name: "Guardar cambios" });

    fireEvent.change(oldPasswordField, { target: { value: "Demo1234" } });
    fireEvent.change(newPasswordField, { target: { value: "Edited1234" } });
    fireEvent.change(repeatPasswordField, { target: { value: "Edited1234" } });

    await waitFor(() => expect(submitButton).toBeEnabled());

    fireEvent.click(submitButton);

    const profileTitle = await screen.findByText("Mi perfil");
    expect(profileTitle).toBeInTheDocument();
});