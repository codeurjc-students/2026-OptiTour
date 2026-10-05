import { expect, test, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

import Index from '../../src/routes/index/index'
import TourDetail from '../../src/routes/tour-detail/tour-detail'
import * as service from '../../src/service/tour-service'
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { TourDTO } from '../../src/dto/tour-dto'

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
    // Thanks to useEffect, it will call getAllTours function, but it will recieve test data instead of real ones. 
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
