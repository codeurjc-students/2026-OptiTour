import { test, vi, expect } from "vitest";
import '@testing-library/jest-dom/vitest';
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { UserDTO } from "../../src/dto/user-dto";
import * as service from '../../src/service/user-service';
import UserManagement from "../../src/routes/admin/user-management";

vi.mock('../../src/service/user-service');

// Test data

var testUsers: UserDTO[] = [];

for (let i = 0; i < 10; i++) {
    testUsers.push({ id: i, email: "example" + i + "@example.com", userName: "user" + i, phoneNumber: "111 111 111", isBanned: false, createdAt: "1/1/2026", roles: ["USER"] });
}

test('User panel shows user ammount', async () => {
    vi.mocked(service.getAllUsers).mockResolvedValue(testUsers as any);

    render(
        <MemoryRouter>
            <UserManagement />
        </ MemoryRouter>
    );

    const ammount = await screen.findByText('10');
    expect(ammount).toBeInTheDocument();
})

test('User panel shows users properly', async () => {
    vi.mocked(service.getAllUsers).mockResolvedValue(testUsers as any);

    const { container } = render(
        <MemoryRouter>
            <UserManagement />
        </ MemoryRouter>
    );

    await waitFor(() => {
        expect(container.querySelectorAll('.ot-user-item').length).toBe(10);
    });

    const userList = container.querySelectorAll('.ot-user-item');

    userList.forEach((user, index) => {
        const userName = user.querySelector('.ot-user-item__name')?.textContent;
        expect(userName).toBe(testUsers[index].userName);
    });
});