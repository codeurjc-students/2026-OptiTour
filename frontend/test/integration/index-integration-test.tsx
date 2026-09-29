// @ts-ignore
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import { expect, test, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { MemoryRouter } from 'react-router-dom';
import Index from '../../src/routes/index/index';
import { Route, Routes } from 'react-router-dom';
import TourDetail from '../../src/routes/tour-detail/tour-detail';

test('Checks if tour-service calls the API and receive data correctly', async () => {
    // We render the index page at the JDOM virtual DOM.
    // With the useEffect function, it will call the API when rendered for first time.
    render(
        <MemoryRouter>
            <Index />
        </MemoryRouter>
    );

    //We get the tour list and check if has 5 elements
    const itemList = await screen.findAllByTestId('tour-card');

    expect(itemList).toHaveLength(8);

    // Now, we check if titles are correct. We create a list and obtain all titles and descs from screen. 
    let tourTitles = new Array();
    let tourDescs = new Array();

    const expectedTitles = [
        "Madrid, España", "Barcelona, España", "Sevilla, España", "Valencia, España", "Bilbao, España"
    ];
    const expectedDescs = [
        "Descubre la capital de España, sus museos y su vibrante vida nocturna.",
        "Maravíllate con la arquitectura de Gaudí y pasea por las Ramblas.",
        "Disfruta de la Giralda, el Alcázar y el encanto andaluz.",
        "Conoce la Ciudad de las Artes y las Ciencias y prueba la auténtica paella.",
        "Visita el museo Guggenheim y degusta los mejores pintxos."
    ];

    for (let i = 0; i < 5; i++) {
        tourTitles.push(await screen.findByText(expectedTitles[i]));
        tourDescs.push(await screen.findByText(expectedDescs[i]));
    }

    // Then, we check all of this texts are in the document:
    tourTitles.forEach(title => {
        expect(title).toBeInTheDocument();
    });

    tourDescs.forEach(desc => {
        expect(desc).toBeInTheDocument();
    });
});

test('Checks if tour detail page receives data correclty from actual API', async () => {
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
