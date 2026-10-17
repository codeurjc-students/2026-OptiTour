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

    fireEvent.click(screen.getByRole("button", { name: "Crear Cuenta" }));

    await waitFor(() => {
        expect(service.signup).toHaveBeenCalledWith({
            email: "example@example.com",
            phoneNumber: "123",
            userName: "tester",
            password: "Demo1234"
        });
        expect(useAuthStore.doLogin).toHaveBeenCalledWith({
            email: "example@example.com",
            password: "Demo1234"
        });
    });
});

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

    fireEvent.click(screen.getByRole("button", { name: "Crear Cuenta" }));

    expect(await screen.findByText("Las contraseñas no coinciden")).toBeInTheDocument();

    expect(service.signup).not.toHaveBeenCalled();
    expect(useAuthStore.doLogin).not.toHaveBeenCalled();
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

    fireEvent.click(screen.getByRole("button", { name: "Crear Cuenta" }));

    await waitFor(() => {
        expect(uploadUserImage).toHaveBeenCalledWith(image, 10);
    });
});
