import { expect, test, vi } from "vitest";
import '@testing-library/jest-dom/vitest';
import * as service from '../../src/service/point-of-interest-service'
import { PointOfInterestDTO } from "../../src/dto/point-of-interest-dto";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import PointOfInterestDetail from '../../src/routes/point-of-interest-detail/point-of-interest-detail';
import POIManagement from "../../src/routes/admin/poi-management/poi-management";
import CreatePointOfInterest from "../../src/routes/admin/create-poi/create-poi";

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

    vi.mocked(service.getPoiById).mockResolvedValue(testPoi as unknown as PointOfInterestDTO);

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

test('Checks if pois are displayed properly in poi panel', async () => {
    let pois: PointOfInterestDTO[] = [];

    for (let i = 0; i < 10; i++) {
        pois.push({
            id: i + 1,
            name: "Test poi " + i,
            description: "Test desc " + i,
            city: "Test",
            address: "Test",
            coords: "Test",
            images: [{ id: 1, name: "test.jpg", path: "/test.jpg" } as any],
            createdAt: "2026-01-01T00:00:00.000Z",
            tours: [
                {
                    id: 1,
                    name: "Test tour",
                    images: []
                }
            ]
        });
    }

    vi.mocked(service.getPoisByPage).mockResolvedValue({
        content: pois,
        page: { number: 0, totalPages: 1, totalElements: 10 }
    } as any);

    const { container } = render(
        <MemoryRouter>
            <POIManagement />
        </MemoryRouter>
    );

    await waitFor(() => {
        expect(container.querySelectorAll('.ot-poi-list-item').length).toBe(10);
    });

    const poiList = container.querySelectorAll('.ot-poi-list-item');
    poiList.forEach((poiItem, index) => {
        const title = poiItem.querySelector('.ot-list-item__title')?.textContent;
        expect(title).toBe(pois[index].name);
    });

    expect(service.getPoisByPage).toHaveBeenCalled();
});

test('Checks if poi-creation form adds poi', async () => {
    render(
        <MemoryRouter>
            <CreatePointOfInterest />
        </MemoryRouter>
    );

    const submitButton = await screen.findByRole('button', { name: "Crear punto de interés" });

    const nameField = await screen.findByLabelText("Nombre del punto de interés");
    const descField = await screen.findByLabelText("Descripción");
    const cityField = await screen.findByLabelText("Ciudad");
    const addressField = await screen.findByLabelText("Dirección");
    const latitudeField = await screen.findByLabelText("Latitud");
    const longitudefield = await screen.findByLabelText("Longitud");
    const firstImage = new File(["first image"], "first-image.png", {
        type: "image/png"
    });
    const secondImage = new File(["second image"], "second-image.jpg", {
        type: "image/jpeg"
    });

    fireEvent.change(nameField, { target: { value: "Test POI" } });
    fireEvent.change(descField, { target: { value: "Test description" } });
    fireEvent.change(cityField, { target: { value: "Test city" } });
    fireEvent.change(addressField, { target: { value: "Test address" } });
    fireEvent.change(latitudeField, { target: { value: "1.11111" } });
    fireEvent.change(longitudefield, { target: { value: "1.11111" } });
    await act(async () => {
        fireEvent.change(document.getElementById("upload-image")!, {
            target: { files: [firstImage, secondImage] }
        });
    });

    await waitFor(() => expect(submitButton).toBeEnabled());
    fireEvent.click(submitButton);

    await waitFor(() => expect(service.createPoi).toHaveBeenCalledWith({
            name: "Test POI",
            description: "Test description",
            city: "Test city",
            address: "Test address",
            coords: `1.11111,1.11111`
        })
    );
});