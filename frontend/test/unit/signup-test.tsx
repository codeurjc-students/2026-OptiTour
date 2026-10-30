import { beforeEach, expect, test, vi } from "vitest";
import * as service from "../../src/service/user-service";
import { useAuthStore as useAuthStoreOriginal } from "../../src/store/auth-store";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { MemoryRouter } from "react-router-dom";
import Signup from "../../src/routes/signup/signup";
import { uploadUserImage } from "../../src/service/user-service";

vi.mock("../../src/service/user-service");
vi.mock("../../src/store/auth-store", () => {
    const doLogin = vi.fn().mockResolvedValue({ id: 10 });
    const refreshProfileImage = vi.fn();
    const useAuthStore = Object.assign(
        vi.fn(() => ({ doLogin, refreshProfileImage })),
        { doLogin, refreshProfileImage }
    );
    return { useAuthStore };
});

const useAuthStore = useAuthStoreOriginal as typeof useAuthStoreOriginal & {
    doLogin: ReturnType<typeof vi.fn>;
    refreshProfileImage: ReturnType<typeof vi.fn>;
};

vi.mock("react-router", () => ({ useNavigate: () => vi.fn() }));

beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(service.signup).mockResolvedValue({ id: 10 });

    render(
        <MemoryRouter>
            <Signup />
        </MemoryRouter>
    );
});


test("Signup registers a user and logs in after valid form data", async () => {
    fireEvent.change(screen.getByLabelText("Correo electrónico"), {
        target: { value: "example@example.com" }
    });
    fireEvent.change(screen.getByLabelText("Número de teléfono"), {
        target: { value: "111 111 111" }
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

    await waitFor(() => {
        expect(screen.getByRole("button", { name: "Crear Cuenta" })).toBeEnabled();
    });

    fireEvent.click(screen.getByRole("button", { name: "Crear Cuenta" }));

    await waitFor(() => {
        expect(service.signup).toHaveBeenCalledWith({
            email: "example@example.com",
            phoneNumber: "111 111 111",
            userName: "tester",
            password: "Demo1234"
        });
        expect(useAuthStore.doLogin).toHaveBeenCalledWith({
            email: "example@example.com",
            password: "Demo1234"
        });
    });
});

test("Signup with image should call uploadUserImage method", async () => {
    const image = new File(["image contents"], "profile.png", {
        type: "image/png"
    });

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
        fireEvent.change(document.getElementById("upload-image")!, {
            target: { files: [image] }
        });
    });

    await waitFor(() => {
        expect(screen.getByRole("button", { name: "Crear Cuenta" })).toBeEnabled();
    });

    fireEvent.click(screen.getByRole("button", { name: "Crear Cuenta" }));

    await waitFor(() => {
        expect(uploadUserImage).toHaveBeenCalledWith(image, 10);
    });
});

// ------------------Field Validation Tests --------------------------------

// ------------------ Invalid Email Tests --------------------------------

test("Singup with empty email should render an error", async () => {

    // Input error labels only appears after first time user writes.
    // If we didn't that, user would see a form full of errors only by
    // loading the page.

    // So, in order to check empty fields, we need to write any character
    // and then deleting it:

    fireEvent.change(screen.getByLabelText("Correo electrónico"), {
        target: { value: "a" }
    });
    fireEvent.change(screen.getByLabelText("Correo electrónico"), {
        target: { value: "" }
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
        target: { value: "Different1" }
    });

    expect(screen.getByRole("button", { name: "Crear Cuenta" })).toBeDisabled();

    expect(await screen.findByText("Las contraseñas no coinciden")).toBeInTheDocument();

    expect(service.signup).not.toHaveBeenCalled();
    expect(useAuthStore.doLogin).not.toHaveBeenCalled();
});

test("Singup with a more of 30 chars email should render an error", async () => {
    fireEvent.change(screen.getByLabelText("Correo electrónico"), {
        target: { value: "aaaaaaaaaaaaaa@aaaaaaaaaaaa.com" }
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
        target: { value: "Different1" }
    });

    expect(screen.getByRole("button", { name: "Crear Cuenta" })).toBeDisabled();

    expect(await screen.findByText("El email no puede superar los 30 caracteres")).toBeInTheDocument();

    expect(service.signup).not.toHaveBeenCalled();
    expect(useAuthStore.doLogin).not.toHaveBeenCalled();
});

test("Singup with an invalid email format should render an error", async () => {
    fireEvent.change(screen.getByLabelText("Correo electrónico"), {
        target: { value: "invalidEmail" }
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
        target: { value: "Different1" }
    });

    expect(screen.getByRole("button", { name: "Crear Cuenta" })).toBeDisabled();

    expect(await screen.findByText("El formato del correo no es válido. (Comprueba que contiene '@' y '.')")).toBeInTheDocument();

    expect(service.signup).not.toHaveBeenCalled();
    expect(useAuthStore.doLogin).not.toHaveBeenCalled();
});

// ------------------ Invalid Phone Tests --------------------------------

test("Singup with a more of 12 chars phone should render an error", async () => {
    fireEvent.change(screen.getByLabelText("Correo electrónico"), {
        target: { value: "example@example.com" }
    });
    fireEvent.change(screen.getByLabelText("Número de teléfono"), {
        target: { value: "111 111 111 111" }
    });
    fireEvent.change(screen.getByLabelText("Nombre de usuario"), {
        target: { value: "tester" }
    });
    fireEvent.change(screen.getByLabelText("Contraseña"), {
        target: { value: "Demo1234" }
    });
    fireEvent.change(screen.getByLabelText("Repetir contraseña"), {
        target: { value: "Different1" }
    });

    expect(screen.getByRole("button", { name: "Crear Cuenta" })).toBeDisabled();

    expect(await screen.findByText("El teléfono no puede superar los 12 caracteres")).toBeInTheDocument();

    expect(service.signup).not.toHaveBeenCalled();
    expect(useAuthStore.doLogin).not.toHaveBeenCalled();
});

test("Singup with a phone with non-number chars should render an error", async () => {
    fireEvent.change(screen.getByLabelText("Correo electrónico"), {
        target: { value: "example@example.com" }
    });
    fireEvent.change(screen.getByLabelText("Número de teléfono"), {
        target: { value: "abc" }
    });
    fireEvent.change(screen.getByLabelText("Nombre de usuario"), {
        target: { value: "tester" }
    });
    fireEvent.change(screen.getByLabelText("Contraseña"), {
        target: { value: "Demo1234" }
    });
    fireEvent.change(screen.getByLabelText("Repetir contraseña"), {
        target: { value: "Different1" }
    });

    expect(screen.getByRole("button", { name: "Crear Cuenta" })).toBeDisabled();

    expect(await screen.findByText("El teléfono solo puede contener números y el prefijo '+'")).toBeInTheDocument();

    expect(service.signup).not.toHaveBeenCalled();
    expect(useAuthStore.doLogin).not.toHaveBeenCalled();
});


// ------------------ Invalid Username Tests --------------------------------

test("Singup with an empty username should render an error", async () => {
    fireEvent.change(screen.getByLabelText("Correo electrónico"), {
        target: { value: "example@example.com" }
    });
    fireEvent.change(screen.getByLabelText("Número de teléfono"), {
        target: { value: "123" }
    });
    fireEvent.change(screen.getByLabelText("Nombre de usuario"), {
        target: { value: "a" }
    });
    fireEvent.change(screen.getByLabelText("Nombre de usuario"), {
        target: { value: "" }
    });
    fireEvent.change(screen.getByLabelText("Contraseña"), {
        target: { value: "Demo1234" }
    });
    fireEvent.change(screen.getByLabelText("Repetir contraseña"), {
        target: { value: "Different1" }
    });

    expect(screen.getByRole("button", { name: "Crear Cuenta" })).toBeDisabled();

    expect(await screen.findByText("El nombre de usuario es obligatorio")).toBeInTheDocument();

    expect(service.signup).not.toHaveBeenCalled();
    expect(useAuthStore.doLogin).not.toHaveBeenCalled();
});

test("Singup with a less of 5 chars username should render an error", async () => {
    fireEvent.change(screen.getByLabelText("Correo electrónico"), {
        target: { value: "example@example.com" }
    });
    fireEvent.change(screen.getByLabelText("Número de teléfono"), {
        target: { value: "123" }
    });
    fireEvent.change(screen.getByLabelText("Nombre de usuario"), {
        target: { value: "1234" }
    });
    fireEvent.change(screen.getByLabelText("Contraseña"), {
        target: { value: "Demo1234" }
    });
    fireEvent.change(screen.getByLabelText("Repetir contraseña"), {
        target: { value: "Different1" }
    });

    expect(screen.getByRole("button", { name: "Crear Cuenta" })).toBeDisabled();

    expect(await screen.findByText("El nombre de usuario debe tener al menos 5 caracteres")).toBeInTheDocument();

    expect(service.signup).not.toHaveBeenCalled();
    expect(useAuthStore.doLogin).not.toHaveBeenCalled();
});

test("Singup with a more of 20 chars username should render an error", async () => {
    fireEvent.change(screen.getByLabelText("Correo electrónico"), {
        target: { value: "example@example.com" }
    });
    fireEvent.change(screen.getByLabelText("Número de teléfono"), {
        target: { value: "123" }
    });
    fireEvent.change(screen.getByLabelText("Nombre de usuario"), {
        target: { value: "invalidinvalidinvalid" }
    });
    fireEvent.change(screen.getByLabelText("Contraseña"), {
        target: { value: "Demo1234" }
    });
    fireEvent.change(screen.getByLabelText("Repetir contraseña"), {
        target: { value: "Different1" }
    });

    expect(screen.getByRole("button", { name: "Crear Cuenta" })).toBeDisabled();

    expect(await screen.findByText("El nombre de usuario no puede superar los 20 caracteres")).toBeInTheDocument();

    expect(service.signup).not.toHaveBeenCalled();
    expect(useAuthStore.doLogin).not.toHaveBeenCalled();
});

// ------------------ Invalid Pass Tests --------------------------------

test("Singup with different passwords should render an error", async () => {
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
        target: { value: "Different1" }
    });

    expect(screen.getByRole("button", { name: "Crear Cuenta" })).toBeDisabled();

    expect(await screen.findByText("Las contraseñas no coinciden")).toBeInTheDocument();

    expect(service.signup).not.toHaveBeenCalled();
    expect(useAuthStore.doLogin).not.toHaveBeenCalled();
});

test("Singup with empty password should render an error", async () => {
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
        target: { value: "a" }
    });
    fireEvent.change(screen.getByLabelText("Contraseña"), {
        target: { value: "" }
    });
    fireEvent.change(screen.getByLabelText("Repetir contraseña"), {
        target: { value: "Different1" }
    });

    expect(screen.getByRole("button", { name: "Crear Cuenta" })).toBeDisabled();

    expect(await screen.findByText("La contraseña es obligatoria")).toBeInTheDocument();

    expect(service.signup).not.toHaveBeenCalled();
    expect(useAuthStore.doLogin).not.toHaveBeenCalled();
});

test("Singup with a less of 8 chars password should render an error", async () => {
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
        target: { value: "1234567" }
    });
    fireEvent.change(screen.getByLabelText("Repetir contraseña"), {
        target: { value: "Different1" }
    });

    expect(screen.getByRole("button", { name: "Crear Cuenta" })).toBeDisabled();

    expect(await screen.findByText("La contraseña debe tener al menos 8 caracteres.")).toBeInTheDocument();

    expect(service.signup).not.toHaveBeenCalled();
    expect(useAuthStore.doLogin).not.toHaveBeenCalled();
});

test("Singup with a more of 20 chars password should render an error", async () => {
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
        target: { value: "invalidinvalidinvalid" }
    });
    fireEvent.change(screen.getByLabelText("Repetir contraseña"), {
        target: { value: "Different1" }
    });

    expect(screen.getByRole("button", { name: "Crear Cuenta" })).toBeDisabled();

    expect(await screen.findByText("La contraseña no puede superar los 20 caracteres.")).toBeInTheDocument();

    expect(service.signup).not.toHaveBeenCalled();
    expect(useAuthStore.doLogin).not.toHaveBeenCalled();
});

test("Singup with a not secure password should render an error", async () => {
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
        target: { value: "invalidpass" }
    });
    fireEvent.change(screen.getByLabelText("Repetir contraseña"), {
        target: { value: "Different1" }
    });

    expect(screen.getByRole("button", { name: "Crear Cuenta" })).toBeDisabled();

    expect(await screen.findByText("La contraseña debe contener al menos una mayúscula, una minúscula y un número.")).toBeInTheDocument();

    expect(service.signup).not.toHaveBeenCalled();
    expect(useAuthStore.doLogin).not.toHaveBeenCalled();
});