// @ts-ignore
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { expect, test } from "vitest";
import '@testing-library/jest-dom/vitest';
import PointOfInterestDetail from '../../src/routes/point-of-interest-detail/point-of-interest-detail';

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