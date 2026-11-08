import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, expect, test, vi } from "vitest";
import EditProfile from "../../src/routes/my-profile/edit-profile";

vi.mock('../../src/service/user-service');

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

vi.mock("../../src/store/auth-store", () => ({
    useAuthStore: () => ({
        setLoggedUser,
    }),
}));


beforeEach(() => {
    vi.clearAllMocks();
});

const { setLoggedUser, mockNavigate } = vi.hoisted(() => ({
    setLoggedUser: vi.fn().mockResolvedValue(undefined),
    mockNavigate: vi.fn(),
}));

test('Submit button should disble when at least one field is not valid', async () => {
    render(
        <MemoryRouter>
            <EditProfile />
        </MemoryRouter>
    );

    const emailField = await screen.findByLabelText("Correo electrónico");
    const phoneField = await screen.findByLabelText("Número de teléfono");
    const userField = await screen.findByLabelText("Nombre de usuario");
    const submitButton = screen.getByRole("button", { name: "Guardar cambios" });

    fireEvent.change(emailField, { target: { value: "example@example.com" } });
    fireEvent.change(phoneField, { target: { value: "111 111 111" } });
    fireEvent.change(userField, { target: { value: "example" } });

    await waitFor(() => expect(submitButton).toBeEnabled());

    fireEvent.change(emailField, { target: { value: "" } });

    await waitFor(() => expect(submitButton).toBeDisabled());

    fireEvent.change(emailField, { target: { value: "updated@example.com" } });
    fireEvent.change(phoneField, { target: { value: "invalid" } });

    await waitFor(() => expect(submitButton).toBeDisabled());

    fireEvent.change(phoneField, { target: { value: "111 111 111" } });
    fireEvent.change(userField, { target: { value: "" } });

    await waitFor(() => expect(submitButton).toBeDisabled());
});

test('Checks user edition with correct inputs workflow', async () => {
    render(
        <MemoryRouter>
            <EditProfile />
        </MemoryRouter>
    );

    const emailField = await screen.findByLabelText("Correo electrónico");
    const phoneField = await screen.findByLabelText("Número de teléfono");
    const userField = await screen.findByLabelText("Nombre de usuario");
    const submitButton = screen.getByRole("button", { name: "Guardar cambios" });

    fireEvent.change(emailField, { target: { value: "updated@example.com" } });
    fireEvent.change(phoneField, { target: { value: "111 111 111" } });
    fireEvent.change(userField, { target: { value: "updated" } });

    await waitFor(() => expect(submitButton).toBeEnabled());

    fireEvent.click(submitButton);

    await waitFor(() => expect(setLoggedUser).toHaveBeenCalled());
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/profile", expect.objectContaining({
        state: expect.objectContaining({ showModal: true })
    })));
});