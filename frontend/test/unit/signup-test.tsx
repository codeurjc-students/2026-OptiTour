import { beforeEach, expect, test, vi } from "vitest";
import * as service from "../../src/service/user-service";
import { useAuthStore as useAuthStoreOriginal } from "../../src/store/auth-store";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { MemoryRouter } from "react-router-dom";
import Signup from "../../src/routes/signup/signup";
import { uploadUserImage } from "../../src/service/user-service";

const action = vi.hoisted(() => vi.fn());

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
vi.mock("react", async () => {
    const actual = await vi.importActual<typeof import("react")>("react");
    return {
        ...actual,
        useActionState: (
            callback: (state: unknown, formData: FormData) => Promise<unknown>,
            initialState: unknown
        ) => {
            const [state, setState] = actual.useState(initialState);
            action.mockImplementation(async (formData: FormData) => {
                const res = await callback(state, formData);
                await actual.act(async () => {
                    setState(res);
                });
            });
            return [state, action, false];
        }
    };
});

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
    const formData = new FormData();
    formData.set("email", "example@example.com");
    formData.set("phone", "123");
    formData.set("userName", "test");
    formData.set("password", "demo1234");
    formData.set("passwordRepeat", "demo1234");

    await action(formData);

    expect(service.signup).toHaveBeenCalledWith({
        email: "example@example.com",
        phoneNumber: "123",
        userName: "test",
        password: "demo1234"
    });
    expect(useAuthStore.doLogin).toHaveBeenCalledWith({
        email: "example@example.com",
        password: "demo1234"
    });
});

test("Singup with different passwords should render an error", async () => {
    const formData = new FormData();
    formData.set("email", "example@example.com");
    formData.set("phone", "123");
    formData.set("userName", "test");
    formData.set("password", "demo1234");
    formData.set("passwordRepeat", "different");

    await action(formData);

    expect(await screen.findByText("Las contraseñas no coinciden")).toBeInTheDocument();

    expect(service.signup).not.toHaveBeenCalled();
    expect(useAuthStore.doLogin).not.toHaveBeenCalled();
});

test("Signup with image should call uploadUserImage method", async () => {
    render(
        <MemoryRouter>
            <Signup />
        </MemoryRouter>
    );

    const image = new File(["image contents"], "profile.png", {
        type: "image/png"
    });

    const formData = new FormData();
    formData.set("email", "example@example.com");
    formData.set("phone", "123");
    formData.set("userName", "test");
    formData.set("password", "demo1234");
    formData.set("passwordRepeat", "demo1234");
    formData.set("image", image);

    await action(formData);

    expect(uploadUserImage).toHaveBeenCalledWith(image, 10);
});
