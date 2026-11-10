// @ts-ignore
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { expect, test } from "vitest";
import '@testing-library/jest-dom/vitest';
import PointOfInterestDetail from '../../src/routes/point-of-interest-detail/point-of-interest-detail';
import { loginAs } from "./integration-test-setup";
import POIManagement from "../../src/routes/admin/poi-management/poi-management";

test('Checkf if point of interest detail page makes API REST petitions correctly', async () => {
    render(
        <MemoryRouter initialEntries={["/point-of-interest/1"]}>
            <Routes>
                <Route path="/point-of-interest/:id" element={<PointOfInterestDetail />} />
            </Routes>
        </MemoryRouter>
    );

    const title = await screen.findByText("Museo del Prado");
    expect(title).toBeInTheDocument();

    const desc = await screen.findByText("Pinacoteca con obras maestras de Velázquez y Goya.");
    expect(desc).toBeInTheDocument();

    const tourTitle = await screen.findByText("Madrid, España");
    expect(tourTitle).toBeInTheDocument();
});

test('Checks if pois are loaded correclty from API', async () => {
    await loginAs("admin@optitour.com", "Admin1234");

    const { container } = render(
        <MemoryRouter initialEntries={["/point-of-interest/1"]}>
            <Routes>
                <Route path="/point-of-interest/:id" element={<POIManagement />} />
            </Routes>
        </MemoryRouter>
    );

    await waitFor(() => {
        expect(container.querySelectorAll('.ot-poi-list-item').length).toBe(10);
    });

    const firstPoiCard = screen.getByText("Museo del Prado");
    expect(firstPoiCard).toBeInTheDocument();

    const loadMoreButton = screen.getByRole('button', { name: "Cargar más" });
    fireEvent.click(loadMoreButton);

    await waitFor(() => {
        expect(container.querySelectorAll('.ot-poi-list-item').length).toBe(15);
    });
});