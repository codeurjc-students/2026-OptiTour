import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { MemoryRouter } from "react-router-dom";
import { expect, test, vi } from "vitest";
import EditPassword from "../../src/routes/my-profile/edit-password";

vi.mock('../../src/service/user-service');

const { mockNavigate } = vi.hoisted(() => ({
    mockNavigate: vi.fn(),
}));

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

test('Submit button should disbale when form data is not valid', async () => {
    render(
        <MemoryRouter>
            <EditPassword />
        </MemoryRouter>
    );

    const oldPasswordField = await screen.findByLabelText("Contraseña actual");
    const newPassowrdField = await screen.findByLabelText("Contraseña");
    const repeatPasswordField = await screen.findByLabelText("Repetir contraseña");
    const submitButton = await screen.findByRole("button", { name: "Guardar cambios" });

    await waitFor(() => expect(submitButton).toBeDisabled());

    fireEvent.change(oldPasswordField, { target: { value: "Demo1234" } });
    fireEvent.change(newPassowrdField, { target: { value: "Edited1234" } });
    fireEvent.change(repeatPasswordField, { target: { value: "Edited1234" } });

    await waitFor(() => expect(submitButton).toBeEnabled());

    fireEvent.change(oldPasswordField, { target: { value: "invalid" } });

    await waitFor(() => expect(submitButton).toBeDisabled());

    fireEvent.change(oldPasswordField, { target: { value: "Demo1234" } });
    fireEvent.change(newPassowrdField, { target: { value: "incorrect" } });

    await waitFor(() => expect(submitButton).toBeDisabled());

    fireEvent.change(newPassowrdField, { target: { value: "Edited1234" } });
    fireEvent.change(repeatPasswordField, { target: { value: "Different1234" } });
});

test('Filling the form with correct inputs should navigate to profile', async () => {
    render(
        <MemoryRouter>
            <EditPassword />
        </MemoryRouter>
    );

    const oldPasswordField = await screen.findByLabelText("Contraseña actual");
    const newPassowrdField = await screen.findByLabelText("Contraseña");
    const repeatPasswordField = await screen.findByLabelText("Repetir contraseña");
    const submitButton = await screen.findByRole("button", { name: "Guardar cambios" });

    await waitFor(() => expect(submitButton).toBeDisabled());

    fireEvent.change(oldPasswordField, { target: { value: "Demo1234" } });
    fireEvent.change(newPassowrdField, { target: { value: "Edited1234" } });
    fireEvent.change(repeatPasswordField, { target: { value: "Edited1234" } });
    await waitFor(() => expect(submitButton).toBeEnabled());
    fireEvent.click(submitButton);

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/profile", expect.objectContaining({
        state: expect.objectContaining({ showModal: true })
    })));
});