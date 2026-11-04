import { beforeEach, expect, test, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { UserDTO } from "../../src/dto/user-dto";
import { MemoryRouter } from "react-router-dom";
import DeleteProfile from "../../src/routes/my-profile/delete-profile";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import * as service from '../../src/service/user-service';

vi.mock('../../src/service/user-service');

const { mockDoLogout, mockNavigate } = vi.hoisted(() => ({
    mockDoLogout: vi.fn().mockResolvedValue(undefined),
    mockNavigate: vi.fn(),
}));

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

vi.mock("../../src/store/auth-store", () => ({
    useAuthStore: () => ({
        doLogout: mockDoLogout,
    }),
}));

beforeEach(() => {
    vi.clearAllMocks();
});

var testUsers: UserDTO[] = [];

for (let i = 0; i < 3; i++) {
    testUsers.push({ id: i, email: "example" + i + "@example.com", userName: "user" + i, phoneNumber: "111 111 111", isBanned: false, createdAt: "1/1/2026", roles: ["USER"] });
}

test('Checks submit button is disabled in appropiate moments', async () => {
    render(
        <MemoryRouter>
            <DeleteProfile />
        </MemoryRouter>
    );

    // Button disabled by default
    const submitButton = screen.getByRole("button", { name: "Eliminar cuenta permanentemente" });
    expect(submitButton).toBeDisabled();

    // Button disabled with only password
    const passwordField = screen.getByLabelText("Contraseña");
    fireEvent.change(passwordField, { target: { value: "password" } });

    expect(submitButton).toBeDisabled();

    // Button disabled with only checkbox
    const checkBox = screen.getByRole("checkbox");
    fireEvent.change(passwordField, { target: { value: "" } });
    fireEvent.click(checkBox);

    expect(submitButton).toBeDisabled();

    // Button is enabled with correct data
    fireEvent.change(passwordField, { target: { value: "password" } });
    await waitFor(() => {
        expect(submitButton).toBeEnabled();
    });
});

test('Checks if click on submit button triggers a successful event flow', async () => {
    vi.mocked(service.deleteloggedUser).mockResolvedValue(testUsers[0]);
    render(
        <MemoryRouter>
            <DeleteProfile />
        </MemoryRouter>
    );

    const passwordField = screen.getByLabelText("Contraseña");
    const checkBox = screen.getByRole("checkbox");
    const submitButton = screen.getByRole("button", { name: "Eliminar cuenta permanentemente" });

    fireEvent.change(passwordField, { target: { value: "password" } });
    fireEvent.click(checkBox);

    await waitFor(() => {
        expect(submitButton).toBeEnabled();
    });

    fireEvent.click(submitButton);

    await waitFor(() => {
        expect(service.deleteloggedUser).toHaveBeenCalledWith({ password: "password" });
        expect(mockDoLogout).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith("/");
    });
});
