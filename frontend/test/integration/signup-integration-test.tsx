// @ts-ignore
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import { expect, test } from "vitest";
import * as service from "../../src/service/user-service";
import Signup from "../../src/routes/signup/signup";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import "@testing-library/jest-dom/vitest";

test("Checks if signup service connects to real REST API and creates a user", async () => {
    const unique = Date.now().toString().slice(-6);
    const newUser = {
        email: `client_int_${unique}@ex.com`,
        phoneNumber: "111 222 333",
        userName: `user_${unique}`,
        password: "Demo1234"
    };

    const response = await service.signup(newUser);

    expect(response).toBeDefined();
    expect(response.id).toBeDefined();
    expect(response.email).toBe(newUser.email);
    expect(response.userName).toBe(newUser.userName);
});

test("Signup component displays error from real REST API when email already exists", async () => {
    render(
        <MemoryRouter initialEntries={["/signup"]}>
            <Routes>
                <Route path="/signup" element={<Signup />} />
                <Route path="/" element={<div>Inicio</div>} />
            </Routes>
        </MemoryRouter>
    );

    // 'carmen@example.com' already exists in the real database (SampleDataService)
    fireEvent.change(screen.getByLabelText("Correo electrónico"), {
        target: { value: "carmen@example.com" }
    });
    fireEvent.change(screen.getByLabelText("Número de teléfono"), {
        target: { value: "111 222 333" }
    });
    fireEvent.change(screen.getByLabelText("Nombre de usuario"), {
        target: { value: `user_${Date.now().toString().slice(-5)}` }
    });
    fireEvent.change(screen.getByLabelText("Contraseña"), {
        target: { value: "Demo1234" }
    });
    fireEvent.change(screen.getByLabelText("Repetir contraseña"), {
        target: { value: "Demo1234" }
    });

    await waitFor(() => {
        expect(screen.getByRole("button", { name: "Crear Cuenta" })).toBeEnabled();
    });

    fireEvent.click(screen.getByRole("button", { name: "Crear Cuenta" }));

    const errorCard = await screen.findByText(
        /El correo electrónico escogido ya está siendo utilizado por otro usuario/i
    );
    expect(errorCard).toBeInTheDocument();
});

test("Signup component displays error from real REST API when username already exists", async () => {
    render(
        <MemoryRouter initialEntries={["/signup"]}>
            <Routes>
                <Route path="/signup" element={<Signup />} />
                <Route path="/" element={<div>Inicio</div>} />
            </Routes>
        </MemoryRouter>
    );

    const unique = Date.now().toString().slice(-6);

    // 'Carmen García' already exists in the real database (SampleDataService)
    fireEvent.change(screen.getByLabelText("Correo electrónico"), {
        target: { value: `u${unique}@ex.com` }
    });
    fireEvent.change(screen.getByLabelText("Número de teléfono"), {
        target: { value: "111 222 333" }
    });
    fireEvent.change(screen.getByLabelText("Nombre de usuario"), {
        target: { value: "Carmen García" }
    });
    fireEvent.change(screen.getByLabelText("Contraseña"), {
        target: { value: "Demo1234" }
    });
    fireEvent.change(screen.getByLabelText("Repetir contraseña"), {
        target: { value: "Demo1234" }
    });

    await waitFor(() => {
        expect(screen.getByRole("button", { name: "Crear Cuenta" })).toBeEnabled();
    });

    fireEvent.click(screen.getByRole("button", { name: "Crear Cuenta" }));

    const errorCard = await screen.findByText(
        /El nombre de usuario escogido ya está siendo utilizado por otro usuario/i
    );
    expect(errorCard).toBeInTheDocument();
});
