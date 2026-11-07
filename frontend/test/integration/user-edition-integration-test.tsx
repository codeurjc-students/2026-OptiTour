import { expect, test, vi } from "vitest";
import * as service from '../../src/service/user-service';
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import "@testing-library/jest-dom/vitest";
import EditProfile from "../../src/routes/my-profile/edit-profile";
import MyProfile from "../../src/routes/my-profile/my-profile";
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

test('Checks if user edition is correct', async () => {
    const unique = Date.now().toString().slice(-6);
    const tempUser = {
        email: `ed_serv_${unique}@example.com`,
        phoneNumber: "111 111 111",
        userName: `user_${unique}`,
        password: "Demo1234"
    };
    const updatedEmail = `updated_${unique}@example.com`;
    const updatedUserName = `updated_${unique}`;

    await service.signup(tempUser);
    await loginAs(tempUser.email, tempUser.password);

    render(
        <MemoryRouter initialEntries={["/profile/edit"]}>
            <Routes>
                <Route path="/profile/edit" element={<EditProfile />} />
                <Route path="/profile" element={<MyProfile />} />
            </Routes>
        </MemoryRouter>
    );

    const emailField = await screen.findByLabelText("Correo electrónico");
    const phoneField = await screen.findByLabelText("Número de teléfono");
    const userField = await screen.findByLabelText("Nombre de usuario");
    const submitButton = screen.getByRole("button", { name: "Guardar cambios" });

    fireEvent.change(emailField, { target: { value: updatedEmail } });
    fireEvent.change(phoneField, { target: { value: "111 111 111" } });
    fireEvent.change(userField, { target: { value: updatedUserName } });

    await waitFor(() => expect(submitButton).toBeEnabled());

    fireEvent.click(submitButton);

    const userName = await screen.findByText(updatedUserName);
    expect(userName).toBeInTheDocument();

    const email = await screen.findByText(updatedEmail);
    expect(email).toBeInTheDocument();
});