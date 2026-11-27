import { expect, test, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

import Index from '../../src/routes/index/index'
import TourDetail from '../../src/routes/tour-detail/tour-detail'
import * as service from '../../src/service/tour-service'
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { TourDTO } from '../../src/dto/tour-dto';
import TourManagement from '../../src/routes/admin/tour-management/tour-management';

// First of all, we mock the service that make the request to backend:
vi.mock('../../src/service/tour-service');

test('Index displays tour list from request', async () => {
    // We create test data and set it to mocked service
    const testTourPage = {
        content: [
            { id: 1, name: 'Test Title', description: 'Test Description 1', images: [{ id: 1 }], pois: [] },
            { id: 2, name: 'Test Title', description: 'Test Description 2', images: [{ id: 2 }], pois: [] }
        ],
        page: { number: 0, totalPages: 1 }
    };
    vi.mocked(service.getToursByPage).mockResolvedValue(testTourPage as any);

    // Now, we render the index component with the JSDOM virtual DOM
    // Thanks to useEffect, it will call getToursByPage, but it will receive test data instead of real ones.
    render(
        <MemoryRouter>
            <Index />
        </MemoryRouter>
    );

    // Once the component is rendered, we check if the list has been created properly.
    // Using find method instead get method allowa us getting the element after the data is loaded from mocked request. 
    const itemList = await screen.findAllByTestId('tour-card');
    expect(itemList).toHaveLength(2);

    // Also, we can check if tour text is correct: 
    const tourDescs = await screen.findAllByText('Test Description 1');
    tourDescs.forEach((tourDesc) => {
        expect(tourDesc).toBeInTheDocument();
    });
});

test('Tour detail displays rquested tour information properly', async () => {
    const testTour = {
        id: 1,
        name: "Madrid, España",
        description: "Descubre la capital de España, sus museos y su vibrante vida nocturna.",
        pois: [
            {
                id: 1,
                name: "Museo del Prado",
                description: "Pinacoteca con obras maestras de Velázquez y Goya.",
                city: "Madrid",
                address: "Calle de Ruiz de Alarcón, 23",
                coords: "40.4137818,-3.6921271"
            },
            {
                id: 2,
                name: "Parque del Retiro",
                description: "Pulmón verde histórico con su estanque grande y Palacio de Cristal.",
                city: "Madrid",
                address: "Plaza de la Independencia, 7",
                coords: "40.4152606,-3.6844995"
            },
            {
                id: 3,
                name: "Palacio Real",
                description: "Residencia oficial de los reyes de España y jardines de Sabatini.",
                city: "Madrid",
                address: "Calle de Bailén, s/n",
                coords: "40.417955,-3.714312"
            }
        ]
    };

    vi.mocked(service.getTourById).mockResolvedValue(testTour as TourDTO);

    render(
        <MemoryRouter initialEntries={["/tour/1"]}>
            <Routes>
                <Route path="/tour/:id" element={<TourDetail />} />
            </Routes>
        </MemoryRouter>
    );

    const title = await screen.findByText("Madrid, España");
    expect(title).toBeInTheDocument();

    const desc = await screen.findByText("Descubre la capital de España, sus museos y su vibrante vida nocturna.");
    expect(desc).toBeInTheDocument();

    const poiTitle = await screen.findByText("Parque del Retiro");
    expect(poiTitle).toBeInTheDocument();
});

test('Checks if tour management shows tours and pagination bar calls service', async () => {
    vi.clearAllMocks();

    const page0Response = {
        content: [
            { id: 1, name: "Madrid, España", description: "Desc 1", images: [{ id: 1 }], pois: [] },
            { id: 2, name: "Barcelona, España", description: "Desc 2", images: [{ id: 2 }], pois: [] }
        ],
        page: { size: 10, number: 0, totalElements: 12, totalPages: 2 }
    };
    const page1Response = {
        content: [
            { id: 11, name: "París, Francia", description: "Desc 11", images: [{ id: 11 }], pois: [] },
            { id: 12, name: "Roma, Italia", description: "Desc 12", images: [{ id: 12 }], pois: [] }
        ],
        page: { size: 10, number: 1, totalElements: 12, totalPages: 2 }
    };

    vi.mocked(service.getToursByPage)
        .mockResolvedValueOnce(page0Response as any)
        .mockResolvedValueOnce(page1Response as any);

    render(
        <MemoryRouter>
            <TourManagement />
        </MemoryRouter>
    );

    expect(await screen.findByText("Madrid, España")).toBeInTheDocument();
    expect(screen.getByText("Barcelona, España")).toBeInTheDocument();
    expect(service.getToursByPage).toHaveBeenCalledWith(0, 10);

    const page1Button = screen.getByRole('button', { name: 'Página 1' });
    const page2Button = screen.getByRole('button', { name: 'Página 2' });
    expect(page1Button).toHaveAttribute('aria-current', 'page');

    fireEvent.click(page2Button);

    await waitFor(() => {
        expect(service.getToursByPage).toHaveBeenCalledWith(1, 10);
    });

    expect(await screen.findByText("París, Francia")).toBeInTheDocument();
    expect(screen.getByText("Roma, Italia")).toBeInTheDocument();
    expect(screen.queryByText("Madrid, España")).not.toBeInTheDocument();
    expect(page2Button).toHaveAttribute('aria-current', 'page');
});