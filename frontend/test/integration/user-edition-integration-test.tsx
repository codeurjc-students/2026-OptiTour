import { beforeAll, afterAll, beforeEach, expect, test, vi } from "vitest";
import * as service from '../../src/service/user-service';
import { login } from "../../src/service/auth-service";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import "@testing-library/jest-dom/vitest";
import EditProfile from "../../src/routes/my-profile/edit-profile";
import MyProfile from "../../src/routes/my-profile/my-profile";

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

test('Checks if user edition is correct', async () => {
    const unique = Date.now().toString().slice(-6);
    const tempUser = {
        email: `ed_serv_${unique}@example.com`,
        phoneNumber: "111 111 111",
        userName: `user_${unique}`,
        password: "Demo1234"
    };
    const updatedEmail = `updated_${unique}@example.com`;
    const updatedUserName = `updated_${unique}`;

    await service.signup(tempUser);
    await login({ email: tempUser.email, password: tempUser.password });

    render(
        <MemoryRouter initialEntries={["/profile/edit"]}>
            <Routes>
                <Route path="/profile/edit" element={<EditProfile />} />
                <Route path="/profile" element={<MyProfile />} />
            </Routes>
        </MemoryRouter>
    );

    const emailField = await screen.findByLabelText("Correo electrónico");
    const phoneField = await screen.findByLabelText("Número de teléfono");
    const userField = await screen.findByLabelText("Nombre de usuario");
    const submitButton = screen.getByRole("button", { name: "Guardar cambios" });

    fireEvent.change(emailField, { target: { value: updatedEmail } });
    fireEvent.change(phoneField, { target: { value: "111 111 111" } });
    fireEvent.change(userField, { target: { value: updatedUserName } });

    await waitFor(() => expect(submitButton).toBeEnabled());

    fireEvent.click(submitButton);

    const userName = await screen.findByText(updatedUserName);
    expect(userName).toBeInTheDocument();

    const email = await screen.findByText(updatedEmail);
    expect(email).toBeInTheDocument();
});