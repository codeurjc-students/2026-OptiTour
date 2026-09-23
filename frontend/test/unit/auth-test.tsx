import { expect, test, vi } from "vitest";
import { UserDTO } from '../../src/dto/user-dto.ts';
import * as service from '../../src/service/auth-service.ts'
import { MemoryRouter } from "react-router";
import MyProfile from '../../src/routes/my-profile/my-profile.tsx';
import { render, screen } from "@testing-library/react";
import { useAuthStore } from "../../src/store/auth-store.tsx";
import '@testing-library/jest-dom';


// We mock the persist middleware in zustand store so it won't need to use localStorage
vi.mock('zustand/middleware', () => ({
    persist: (config: any) => config
}));

vi.mock('../../src/service/auth-service.ts');

test('Profile displays logged user data', async () => {
    // Given: a sample user
    const testUser: UserDTO = {
        id: 1,
        email: "example@example.com",
        userName: "example",
        phoneNumber: "111 111 111",
        roles: ["USER"],
    }

    // We set the store state to assume that user is logged, because MyProfile component draws loggedUser data stored in auth-store
    useAuthStore.setState({ loggedUser: testUser });

    // When: the component renders with this sample user
    render(
        <MemoryRouter>
            <MyProfile />
        </ MemoryRouter>
    );

    // Then: the user data are rendered in the component
    const userName = await screen.findByText("example");
    const email = await screen.findByText("example@example.com");
    const phoneNumber = await screen.findByText("111 111 111");

    expect(userName).toBeInTheDocument();
    expect(email).toBeInTheDocument();
    expect(phoneNumber).toBeInTheDocument();
});

test('Check if store does logout correctly', async () => {
    // Given: a sample user
    const testUser: UserDTO = {
        id: 1,
        email: "example@example.com",
        userName: "example",
        phoneNumber: "111 111 111",
        roles: ["USER"],
    }

    useAuthStore.setState({ loggedUser: testUser });
    vi.mocked(service.logout);

    // When: we logout
    await useAuthStore.getState().doLogout();

    // Then: loggedUser must to be null

    expect(useAuthStore.getState().loggedUser).toBeNull();
})