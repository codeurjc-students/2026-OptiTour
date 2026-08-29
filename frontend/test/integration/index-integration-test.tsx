import { expect, test, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

import Index from '../../src/routes/index'
import { TourDTO } from '../../src/dto/TourDTO';


test('Checks if tour-service calls the API and receive data correctly', async () => {
    // We render the index page at the JDOM virtual DOM.
    // With the useEffect function, it will call the API when rendered for first time.
    render(<Index />);

    //We get the tour list and check if has 5 elements
    const itemList = await screen.findAllByRole('listitem');

    expect(itemList).toHaveLength(5);

    // Now, we check if titles are correct. We create a list and obtain all titles and descs from screen. 
    let tourTitles = new Array();
    let tourDescs = new Array();

    for (let i = 1; i < 6; i++) {
        tourTitles.push(await screen.findByText(i + ': Tour ' + i));
        tourDescs.push(await screen.findByText('Tour de ejemplo numero ' + i));
    }

    // Then, we check all of this texts are in the document:
    tourTitles.forEach(title => {
        expect(title).toBeInTheDocument();
    });

    tourDescs.forEach(desc => {
        expect(desc).toBeInTheDocument();
    });


});