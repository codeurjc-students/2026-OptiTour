import { expect, test, vi } from "vitest";
import { UserDTO } from '../../src/dto/user-dto.ts';
import * as service from '../../src/service/auth-service.ts'
import { MemoryRouter } from "react-router-dom";
import MyProfile from '../../src/routes/my-profile/my-profile.tsx';
import Login from '../../src/routes/login/login.tsx';
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useAuthStore } from "../../src/store/auth-store.tsx";
import '@testing-library/jest-dom/vitest';


// We mock the persist middleware in zustand store so it won't need to use localStorage
vi.mock('zustand/middleware', () => ({
    persist: (config: any) => config
}));

vi.mock('../../src/service/auth-service.ts');

test('Profile displays logged user data', async () => {
    // Given: a sample user
    const testUser: UserDTO = {
        id: 1,
        email: "carmen@example.com",
        userName: "Carmen García",
        phoneNumber: "611 223 344",
        roles: ["USER"],
    }

    // We set the store state to assume that user is logged, because MyProfile component draws loggedUser data stored in auth-store
    useAuthStore.setState({ loggedUser: testUser });

    // When: the component renders with this sample user
    render(
        <MemoryRouter>
            <MyProfile />
        </ MemoryRouter>
    );

    // Then: the user data are rendered in the component
    const userName = await screen.findByText("Carmen García");
    const email = await screen.findByText("carmen@example.com");
    const phoneNumber = await screen.findByText("611 223 344");

    expect(userName).toBeInTheDocument();
    expect(email).toBeInTheDocument();
    expect(phoneNumber).toBeInTheDocument();
});

test('Check if store does logout correctly', async () => {
    // Given: a sample user
    const testUser: UserDTO = {
        id: 1,
        email: "carmen@example.com",
        userName: "Carmen García",
        phoneNumber: "611 223 344",
        roles: ["USER"],
    }

    useAuthStore.setState({ loggedUser: testUser });
    vi.mocked(service.logout);

    // When: we logout
    await useAuthStore.getState().doLogout();

    // Then: loggedUser must to be null

    expect(useAuthStore.getState().loggedUser).toBeNull();
});


// ------------------ Field Validation Tests --------------------------------

// ------------------ Email Validation Tests --------------------------------

test("Logging in with an empty email should render an error", async () => {
    render(
        <MemoryRouter>
            <Login />
        </ MemoryRouter>
    );
    fireEvent.change(screen.getByLabelText("Correo electrónico:"), {
        target: { value: "a" }
    });
    fireEvent.change(screen.getByLabelText("Correo electrónico:"), {
        target: { value: "" }
    });
    fireEvent.change(screen.getByLabelText("Contraseña:"), {
        target: { value: "Demo1234" }
    });

    expect(screen.getByRole("button", { name: /acceder/i })).toBeDisabled();

    expect(await screen.findByText("El email es obligatorio")).toBeInTheDocument();
});

test("Logging in with an email longer than 30 chars should render an error", async () => {
    render(
        <MemoryRouter>
            <Login />
        </ MemoryRouter>
    );
    fireEvent.change(screen.getByLabelText("Correo electrónico:"), {
        target: { value: "aaaaaaaaaaaaaa@aaaaaaaaaaaa.com" }
    });
    fireEvent.change(screen.getByLabelText("Contraseña:"), {
        target: { value: "Demo1234" }
    });

    expect(screen.getByRole("button", { name: /acceder/i })).toBeDisabled();

    expect(await screen.findByText("El email no puede superar los 30 caracteres")).toBeInTheDocument();
});

test("Logging in with an invalid email format should render an error", async () => {
    render(
        <MemoryRouter>
            <Login />
        </ MemoryRouter>
    );
    fireEvent.change(screen.getByLabelText("Correo electrónico:"), {
        target: { value: "invalidEmail" }
    });
    fireEvent.change(screen.getByLabelText("Contraseña:"), {
        target: { value: "Demo1234" }
    });

    expect(screen.getByRole("button", { name: /acceder/i })).toBeDisabled();

    expect(await screen.findByText("El formato del correo no es válido. (Comprueba que contiene '@' y '.')")).toBeInTheDocument();
});

// ------------------ Password Validation Tests --------------------------------

test("Logging in with an empty password should render an error", async () => {
    render(
        <MemoryRouter>
            <Login />
        </ MemoryRouter>
    );
    fireEvent.change(screen.getByLabelText("Correo electrónico:"), {
        target: { value: "example@example.com" }
    });
    fireEvent.change(screen.getByLabelText("Contraseña:"), {
        target: { value: "a" }
    });
    fireEvent.change(screen.getByLabelText("Contraseña:"), {
        target: { value: "" }
    });

    expect(screen.getByRole("button", { name: /acceder/i })).toBeDisabled();

    expect(await screen.findByText("La contraseña debe tener al menos 8 caracteres")).toBeInTheDocument();
});

test("Logging in with a password shorter than 8 chars should render an error", async () => {
    render(
        <MemoryRouter>
            <Login />
        </ MemoryRouter>
    );
    fireEvent.change(screen.getByLabelText("Correo electrónico:"), {
        target: { value: "example@example.com" }
    });
    fireEvent.change(screen.getByLabelText("Contraseña:"), {
        target: { value: "1234567" }
    });

    expect(screen.getByRole("button", { name: /acceder/i })).toBeDisabled();

    expect(await screen.findByText("La contraseña debe tener al menos 8 caracteres")).toBeInTheDocument();
});

test("Logging in with a password longer than 20 chars should render an error", async () => {
    render(
        <MemoryRouter>
            <Login />
        </ MemoryRouter>
    );
    fireEvent.change(screen.getByLabelText("Correo electrónico:"), {
        target: { value: "example@example.com" }
    });
    fireEvent.change(screen.getByLabelText("Contraseña:"), {
        target: { value: "123456789012345678901" }
    });

    expect(screen.getByRole("button", { name: /acceder/i })).toBeDisabled();

    expect(await screen.findByText("La contraseña no puede superar los 20 caracteres")).toBeInTheDocument();
});

// ------------------ Valid Credentials Test --------------------------------

test("Logging in with valid credentials should enable submit button", async () => {
    render(
        <MemoryRouter>
            <Login />
        </ MemoryRouter>
    );
    fireEvent.change(screen.getByLabelText("Correo electrónico:"), {
        target: { value: "example@example.com" }
    });
    fireEvent.change(screen.getByLabelText("Contraseña:"), {
        target: { value: "Demo1234" }
    });

    await waitFor(() => {
        expect(screen.getByRole("button", { name: /acceder/i })).toBeEnabled();
    });
});
