import { expect, test } from "vitest";
import { fireEvent, render, screen, waitForElementToBeRemoved, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom/vitest";
import UserManagement from "../../src/routes/admin/user-management/user-management";
import { loginAs } from "./integration-test-setup";

test('Shows spinner while fetching from API. Then, renders user panel', async () => {
    // First of all, it's necessary to be logged as admin
    await loginAs("admin@optitour.com", "Admin1234");

    render(
        <MemoryRouter>
            <UserManagement />
        </MemoryRouter>
    );

    // We check if spinner renders in first place.
    const spinner = screen.getByRole("status");
    expect(spinner).toBeInTheDocument();

    // Once fetching ends, we check if spinner is removed
    await waitForElementToBeRemoved(() => screen.queryByRole("status"));

    // Then, we check if page renders properly.
    // We check if static title and first user received are in DOM
    const title = await screen.findByText("Panel de gestión de usuarios");
    expect(title).toBeInTheDocument();

    const carmen = await screen.findByText("Carmen García");
    expect(carmen).toBeInTheDocument();
});

test('Checks if block button works properly', async () => {
    await loginAs("admin@optitour.com", "Admin1234");

    render(
        <MemoryRouter>
            <UserManagement />
        </MemoryRouter>
    );

    // First of all, we want to find only one button. There are multiple block buttons
    // We get one user to get its button
    const userName = await screen.findByText("Laura Martínez");

    // Then, we get its user card in the UI
    const userCard = userName.closest(".ot-user-item") as HTMLElement;

    // With within, now we get only the block button located in userCard
    const blockButton = await within(userCard).findByRole('button', { name: /Bloquear/i });
    fireEvent.click(blockButton);

    const unblockButton = await within(userCard).findByRole('button', { name: /Desbloquear/i });
    expect(unblockButton).toBeInTheDocument();

    // Restore original state so subsequent test runs remain idempotent
    fireEvent.click(unblockButton);
    await within(userCard).findByRole('button', { name: /Bloquear/i });
});

test('Checks if front forbides admins to block themselves', async () => {
    await loginAs("admin@optitour.com", "Admin1234");

    render(
        <MemoryRouter>
            <UserManagement />
        </MemoryRouter>
    );

    const adminName = await screen.findByText("Admin");
    const adminCard = adminName.closest(".ot-user-item") as HTMLElement;

    const blockButton = within(adminCard).getByRole('button', { name: /Bloquear/i });
    expect(blockButton).toBeDisabled();
});

test('Checks if view profile button url is correct', async () => {
    await loginAs("admin@optitour.com", "Admin1234");

    render(
        <MemoryRouter>
            <UserManagement />
        </MemoryRouter>
    );

    const userName = await screen.findByText("Carmen García");
    const userCard = userName.closest(".ot-user-item") as HTMLElement;

    const viewProfileButton = await within(userCard).findByRole('link', { name: /Ver perfil/i });
    expect(viewProfileButton).toHaveAttribute("href", expect.stringMatching(/^\/admin\/users\/\d+$/));
});
