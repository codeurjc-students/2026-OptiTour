import { act, fireEvent, render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import PaginationBar from "../../src/components/pagination-bar/pagination-bar";

test('PaginationBar renders nothing when totalPages is less than 1', () => {
    const { container } = render(<PaginationBar totalPages={0} />);
    expect(container.firstChild).toBeNull();
});

test('PaginationBar renders all page buttons when they fit in screen width', () => {
    window.innerWidth = 1024;
    render(<PaginationBar totalPages={5} />);

    for (let page = 1; page <= 5; page++) {
        expect(screen.getByRole('button', { name: `Página ${page}` })).toBeInTheDocument();
    }
    expect(screen.getByRole('button', { name: 'Página 1' })).toHaveAttribute('aria-current', 'page');
    expect(screen.queryByText('...')).not.toBeInTheDocument();
});

test('PaginationBar updates active page and calls onPageChange when clicking a button', () => {
    window.innerWidth = 1024;
    const onPageChange = vi.fn();
    render(<PaginationBar totalPages={5} onPageChange={onPageChange} />);

    const page3 = screen.getByRole('button', { name: 'Página 3' });
    fireEvent.click(page3);

    expect(onPageChange).toHaveBeenCalledWith(3);
    expect(page3).toHaveAttribute('aria-current', 'page');
});

test('PaginationBar truncates buttons with ellipsis on narrow screens', () => {
    window.innerWidth = 300;
    render(<PaginationBar totalPages={10} currentPage={5} />);

    expect(screen.getByRole('button', { name: 'Página 1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Página 4' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Página 5' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'Página 6' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Página 10' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Página 2' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Página 8' })).not.toBeInTheDocument();
    expect(screen.getAllByText('...')).toHaveLength(2);
});

test('PaginationBar updates visible buttons when window resizes', () => {
    window.innerWidth = 300;
    render(<PaginationBar totalPages={10} currentPage={5} />);

    expect(screen.queryByRole('button', { name: 'Página 2' })).not.toBeInTheDocument();

    act(() => {
        window.innerWidth = 1024;
        window.dispatchEvent(new Event('resize'));
    });

    for (let page = 1; page <= 10; page++) {
        expect(screen.getByRole('button', { name: `Página ${page}` })).toBeInTheDocument();
    }
    expect(screen.queryByText('...')).not.toBeInTheDocument();
});
