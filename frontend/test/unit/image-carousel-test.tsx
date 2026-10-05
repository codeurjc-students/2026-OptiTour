import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import "@testing-library/jest-dom/vitest";
import ImageCarousel from "../../src/components/image-carousel/image-carousel";

test('Check if carousel component shows tour card if tour list is provided', () => {
    render(<ImageCarousel
        tours={[
            {
                id: 1,
                name: 'Madrid, España',
                description: 'Descubre Madrid',
                images: [{ id: 20 }],
                pois: []
            }
        ]}
    />);

    expect(screen.getByText('Madrid, España')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Ver más' })).toHaveAttribute('href', '/tour/1');
});

test("Check if carousel component don't shows tour card if tour is not provided", () => {
    render(<ImageCarousel
        images={['/image/1']}
    />);

    const image = screen.getByRole("img");

    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "/image/1")
});