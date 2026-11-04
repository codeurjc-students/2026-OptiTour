import { beforeAll, afterAll, beforeEach, expect, test, vi } from "vitest";
import * as service from '../../src/service/user-service';
import { login } from "../../src/service/auth-service";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import "@testing-library/jest-dom/vitest";
import DeleteProfile from "../../src/routes/my-profile/delete-profile";

// @ts-ignore
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// Mock the persist middleware in zustand store so it won't fail on missing localStorage in Node/Vitest
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

let cookieJar: string[] = [];
const originalFetch = globalThis.fetch;

beforeAll(() => {
    globalThis.fetch = async (input, init = {}) => {
        const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
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
    cookieJar = [];
});

beforeEach(() => {
    cookieJar = [];
});

test("Filling form with correct data should delete logged user", async () => {
    // We create a unique user from current date
    const unique = Date.now().toString().slice(-6);
    const tempUser = {
        email: `del_serv_${unique}@example.com`,
        phoneNumber: "111 111 111",
        userName: `user_${unique}`,
        password: "Demo1234"
    };

    await service.signup(tempUser);
    await login({ email: tempUser.email, password: tempUser.password });

    render(
        <MemoryRouter initialEntries={["/profile/delete"]}>
            <Routes>
                <Route path="/profile/delete" element={<DeleteProfile />} />
                <Route path="/" element={<div>Explora nuestro catálogo de tours</div>} />
            </Routes>
        </MemoryRouter>
    );

    const passwordField = screen.getByLabelText("Contraseña");
    const checkBox = screen.getByRole("checkbox");
    const submitButton = screen.getByRole("button", { name: "Eliminar cuenta permanentemente" });

    fireEvent.change(passwordField, { target: { value: "Demo1234" } });
    fireEvent.click(checkBox);

    // Wait for async validation (Zod) to enable the button before clicking
    await waitFor(() => {
        expect(submitButton).toBeEnabled();
    });

    fireEvent.click(submitButton);

    // Wait for the backend request to finish and navigate to "/"
    expect(await screen.findByText("Explora nuestro catálogo de tours", {}, { timeout: 10000 })).toBeInTheDocument();
}, 20000);

test("Filling form with incorrect pass should delete logged user", async () => {
    // We create a unique user from current date
    const unique = Date.now().toString().slice(-6);
    const tempUser = {
        email: `del_serv_${unique}@example.com`,
        phoneNumber: "111 111 111",
        userName: `user_${unique}`,
        password: "Demo1234"
    };

    await service.signup(tempUser);
    await login({ email: tempUser.email, password: tempUser.password });

    render(
        <MemoryRouter initialEntries={["/profile/delete"]}>
            <Routes>
                <Route path="/profile/delete" element={<DeleteProfile />} />
                <Route path="/" element={<div>Explora nuestro catálogo de tours</div>} />
            </Routes>
        </MemoryRouter>
    );

    const passwordField = screen.getByLabelText("Contraseña");
    const checkBox = screen.getByRole("checkbox");
    const submitButton = screen.getByRole("button", { name: "Eliminar cuenta permanentemente" });

    fireEvent.change(passwordField, { target: { value: "incorrect" } });
    fireEvent.click(checkBox);

    // Wait for async validation (zod) to enable the button before clicking
    await waitFor(() => {
        expect(submitButton).toBeEnabled();
    });

    fireEvent.click(submitButton);

    const errorCard = await screen.findByText("La contraseña no es correcta.");
    expect(errorCard).toBeInTheDocument();
}, 20000);