import { test, vi, expect, beforeEach } from "vitest";
import '@testing-library/jest-dom/vitest';
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { UserDTO } from "../../src/dto/user-dto";
import * as service from '../../src/service/user-service';
import UserManagement from "../../src/routes/admin/user-management/user-management";

vi.mock('../../src/service/user-service');

beforeEach(() => {
    vi.clearAllMocks();
});

// Test data

var testUsers: UserDTO[] = [];

for (let i = 0; i < 10; i++) {
    testUsers.push({ id: i, email: "example" + i + "@example.com", userName: "user" + i, phoneNumber: "111 111 111", isBanned: false, createdAt: "1/1/2026", roles: ["USER"] });
}

test('User panel shows user ammount', async () => {
    vi.mocked(service.getPagedUsers).mockResolvedValue({
        content: testUsers,
        page: { number: 0, totalPages: 1, totalElements: 10 }
    } as any);

    render(
        <MemoryRouter>
            <UserManagement />
        </ MemoryRouter>
    );

    const ammount = await screen.findByText('10');
    expect(ammount).toBeInTheDocument();
})

test('User panel shows users properly', async () => {
    vi.mocked(service.getPagedUsers).mockResolvedValue({
        content: testUsers,
        page: { number: 0, totalPages: 1, totalElements: 10 }
    } as any);

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

test('Clicking load more appends additional users', async () => {
    const initialUsers = testUsers.slice(0, 5);
    const moreUsers = testUsers.slice(5, 10);

    vi.mocked(service.getPagedUsers)
        .mockResolvedValueOnce({
            content: initialUsers,
            page: { number: 0, totalPages: 2, totalElements: 8 }
        } as any)
        .mockResolvedValueOnce({
            content: moreUsers,
            page: { number: 1, totalPages: 2, totalElements: 8 }
        } as any);

    const { container } = render(
        <MemoryRouter>
            <UserManagement />
        </MemoryRouter>
    );

    await waitFor(() => {
        expect(container.querySelectorAll('.ot-user-item').length).toBe(5);
    });

    const loadMoreButton = screen.getByRole('button', { name: "Cargar más" });
    expect(loadMoreButton).toBeInTheDocument();

    fireEvent.click(loadMoreButton);

    await waitFor(() => {
        expect(container.querySelectorAll('.ot-user-item').length).toBe(10);
    });

    expect(service.getPagedUsers).toHaveBeenCalledWith(0, 10);
    expect(service.getPagedUsers).toHaveBeenCalledWith(2, 5);
});
