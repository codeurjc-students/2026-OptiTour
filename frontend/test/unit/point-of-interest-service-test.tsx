import { expect, test, vi } from "vitest";
import '@testing-library/jest-dom/vitest';
import * as service from '../../src/service/point-of-interest-service'
import { PointOfInterestDTO } from "../../src/dto/point-of-interest-dto";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import PointOfInterestDetail from '../../src/routes/point-of-interest-detail/point-of-interest-detail';


vi.mock('../../src/service/point-of-interest-service');

test('Point of interest detail displays requierded poi information properly', async () => {
    const testPoi = {
        id: 1,
        name: "Museo del Prado",
        description: "Pinacoteca con obras maestras de Velázquez y Goya.",
        city: "Madrid",
        address: "Calle de Ruiz de Alarcón, 23",
        coords: "40.4137818,-3.6921271",
        tours: [
            {
                id: 1,
                name: "Madrid, España",
                description: "Descubre la capital de España, sus museos y su vibrante vida nocturna."
            },
        ]
    };

    vi.mocked(service.getPoiById).mockResolvedValue(testPoi as PointOfInterestDTO);

    render(
        <MemoryRouter initialEntries={["/tour/1"]}>
            <Routes>
                <Route path="/tour/:id" element={<PointOfInterestDetail />} />
            </Routes>
        </MemoryRouter>
    );

    const title = await screen.findByText("Museo del Prado");
    expect(title).toBeInTheDocument();

    const desc = await screen.findByText("Pinacoteca con obras maestras de Velázquez y Goya.");
    expect(desc).toBeInTheDocument();

    const cityAndAddress = await screen.findByText("Madrid: Calle de Ruiz de Alarcón, 23");
    expect(cityAndAddress).toBeInTheDocument();

    const coords = await screen.findByText("40.4137818,-3.6921271");
    expect(coords).toBeInTheDocument();

    const tourTitle = await screen.findByText("Madrid, España");
    expect(tourTitle).toBeInTheDocument();

});