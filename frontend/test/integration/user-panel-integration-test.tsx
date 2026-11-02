import { beforeAll, afterAll, expect, test } from "vitest";
import { fireEvent, render, screen, waitForElementToBeRemoved, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom/vitest";
import UserManagement from "../../src/routes/admin/user-management";
import { login } from "../../src/service/auth-service";

// @ts-ignore
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// In Node.js / Vitest, fetch does not store or forward cookies automatically like a browser does.
// We intercept fetch to keep an in-memory cookie jar for authenticated integration tests.
let cookieJar: string[] = [];
const originalFetch = globalThis.fetch;

beforeAll(() => {
    globalThis.fetch = async (input, init = {}) => {
        const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
        // Endpoints configured as .anonymous() in Spring Security (like /auth/login or POST /user/)
        // must NOT receive an existing AuthToken cookie, or Spring Security will return 403 Forbidden.
        const isAnonymousOnly = url.includes("/auth/login") || (url.includes("/user/") && init.method === "POST");

        const headers = new Headers(init.headers || {});
        if (cookieJar.length > 0 && !headers.has("Cookie") && !isAnonymousOnly) {
            headers.set("Cookie", cookieJar.join("; "));
        }
        const res = await originalFetch(input, { ...init, headers });

        const setCookies = typeof res.headers.getSetCookie === "function"
            ? res.headers.getSetCookie()
            : [res.headers.get("set-cookie")].filter(Boolean) as string[];

        for (const cookieStr of setCookies) {
            const pair = cookieStr.split(";")[0];
            const name = pair.split("=")[0];
            cookieJar = cookieJar.filter(c => !c.startsWith(`${name}=`));
            cookieJar.push(pair);
        }

        return res;
    };
});

afterAll(() => {
    globalThis.fetch = originalFetch;
});

test('Shows spinner while fetching from API. Then, renders user panel', async () => {
    // First of all, it's necessary to be logged as admin
    await login({ email: "admin@optitour.com", password: "Admin1234" });

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
    const title = await screen.findByText("Gestión de usuarios");
    expect(title).toBeInTheDocument();

    const carmen = await screen.findByText("Carmen García");
    expect(carmen).toBeInTheDocument();
});

test('Checks if block button works properly', async () => {
    await login({ email: "admin@optitour.com", password: "Admin1234" });

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

test('Checks if front forbids admins to block themselves', async () => {
    await login({ email: "admin@optitour.com", password: "Admin1234" });

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
    await login({ email: "admin@optitour.com", password: "Admin1234" });

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
