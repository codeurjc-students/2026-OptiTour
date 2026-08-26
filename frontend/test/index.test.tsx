import { expect, test, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

import Index from '../src/routes/index'
import * as service from '../src/service/tour_service'

// First of all, we mock the service that make the request to backend:
vi.mock('../src/service/tour_service');

test('Index displays tour list from request', async () => {
    // We create test data and set it to mocked service
    const testTour = [{ id: 1, name: 'Test Title', description: 'Test Description 1' }, { id: 2, name: 'Test Title', description: 'Test Description 2' }];
    vi.mocked(service.getAllTours).mockResolvedValue(testTour);

    // Now, we render the index component with the JSDOM virtual DOM
    // Thanks to useEffect, it will call getAllTours function, but it will recieve test data instead of real ones. 
    render(<Index />);

    // Once the component is rendered, we check if the list has been created properly.
    // Using find method instead get method allowa us getting the element after the data is loaded from mocked request. 
    const listItems = await screen.findAllByRole('listitem');

    // We expect listItems to have 2 test tours:
    expect(listItems).toHaveLength(2);

    // Also, we can check if tour text is correct: 
    const tourTitle = await screen.findByText('1: Test Title');
    const tourDesc = await screen.findByText('Test Description 1');

    expect(tourTitle).toBeInTheDocument();
    expect(tourDesc).toBeInTheDocument();
});