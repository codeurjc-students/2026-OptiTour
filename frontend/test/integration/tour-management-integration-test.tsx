// @ts-ignore
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import { expect, test } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom/vitest";
import TourManagement from "../../src/routes/admin/tour-management/tour-management";
import { loginAs } from "./integration-test-setup";

test("Checks if tour management loads pages from API when using pagination bar", async () => {
    await loginAs("admin@optitour.com", "Admin1234");

    const { container } = render(
        <MemoryRouter>
            <TourManagement />
        </MemoryRouter>
    );

    // Page 1 (API page 0, 10 tours)
    await waitFor(() => {
        expect(container.querySelectorAll(".ot-tour-list-item").length).toBe(10);
    }, { timeout: 10000 });

    expect(screen.getByText("Madrid, España")).toBeInTheDocument();
    expect(screen.getByText("Santiago de Compostela, España")).toBeInTheDocument();
    expect(screen.queryByText("París, Francia")).not.toBeInTheDocument();

    const page1Button = screen.getByRole("button", { name: "Página 1" });
    const page2Button = screen.getByRole("button", { name: "Página 2" });
    expect(page1Button).toHaveAttribute("aria-current", "page");

    // Navigate to page 2 (API page 1)
    fireEvent.click(page2Button);

    expect(await screen.findByText("París, Francia", {}, { timeout: 10000 })).toBeInTheDocument();
    expect(screen.getByText("Nueva York, EE. UU.")).toBeInTheDocument();
    expect(screen.queryByText("Madrid, España")).not.toBeInTheDocument();
    expect(container.querySelectorAll(".ot-tour-list-item").length).toBe(10);
    expect(page2Button).toHaveAttribute("aria-current", "page");
}, 20000);
