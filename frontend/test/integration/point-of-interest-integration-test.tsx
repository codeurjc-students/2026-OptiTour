// @ts-ignore
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { expect, test } from "vitest";
import '@testing-library/jest-dom/vitest';
import PointOfInterestDetail from '../../src/routes/point-of-interest-detail/point-of-interest-detail';
import { loginAs } from "./integration-test-setup";
import POIManagement from "../../src/routes/admin/poi-management/poi-management";
import CreatePointOfInterest from "../../src/routes/admin/create-poi/create-poi";

function renderPoiCreationForm() {
    render(
        <MemoryRouter>
            <CreatePointOfInterest />
        </MemoryRouter>
    );
}

function fillValidPoiForm() {
    fireEvent.change(screen.getByLabelText("Nombre del punto de interés"), {
        target: { value: "Test POI" }
    });
    fireEvent.change(screen.getByLabelText("Descripción"), {
        target: { value: "Test description" }
    });
    fireEvent.change(screen.getByLabelText("Ciudad"), {
        target: { value: "Test city" }
    });
    fireEvent.change(screen.getByLabelText("Dirección"), {
        target: { value: "Test address" }
    });
    fireEvent.change(screen.getByLabelText("Latitud"), {
        target: { value: "1.11111" }
    });
    fireEvent.change(screen.getByLabelText("Longitud"), {
        target: { value: "1.11111" }
    });
    fireEvent.change(document.getElementById("upload-image")!, {
        target: {
            files: [new File(["image contents"], "poi.png", { type: "image/png" })]
        }
    });
}

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

// ------------------ Field Validation Tests --------------------------------

// ------------------ Name Validation Tests ---------------------------------

test("POI with an empty name should render an error", async () => {
    renderPoiCreationForm();
    fillValidPoiForm();

    fireEvent.change(screen.getByLabelText("Nombre del punto de interés"), {
        target: { value: "a" }
    });
    fireEvent.change(screen.getByLabelText("Nombre del punto de interés"), {
        target: { value: "" }
    });

    expect(await screen.findByText("El nombre es obligatorio")).toBeInTheDocument();
});

test("POI with a name longer than 30 characters should render an error", async () => {
    renderPoiCreationForm();
    fillValidPoiForm();

    fireEvent.change(screen.getByLabelText("Nombre del punto de interés"), {
        target: { value: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" }
    });

    expect(await screen.findByText("El nombre no puede superaro los 30 caracteres")).toBeInTheDocument();
});

// ------------------ Description Validation Tests --------------------------

test("POI with an empty description should render an error", async () => {
    renderPoiCreationForm();
    fillValidPoiForm();

    fireEvent.change(screen.getByLabelText("Descripción"), {
        target: { value: "a" }
    });
    fireEvent.change(screen.getByLabelText("Descripción"), {
        target: { value: "" }
    });

    expect(await screen.findByText("La descripción es obligatoria")).toBeInTheDocument();
});

test("POI with a description longer than 300 characters should render an error", async () => {
    renderPoiCreationForm();
    fillValidPoiForm();

    fireEvent.change(screen.getByLabelText("Descripción"), {
        target: { value: "a".repeat(301) }
    });

    expect(await screen.findByText("La descripción no puede superar los 300 caracteres")).toBeInTheDocument();
});

// ------------------ City Validation Tests ---------------------------------

test("POI with an empty city should render an error", async () => {
    renderPoiCreationForm();
    fillValidPoiForm();

    fireEvent.change(screen.getByLabelText("Ciudad"), {
        target: { value: "a" }
    });
    fireEvent.change(screen.getByLabelText("Ciudad"), {
        target: { value: "" }
    });

    expect(await screen.findByText("La ciudad es obligatoria")).toBeInTheDocument();
});

test("POI with a city longer than 30 characters should render an error", async () => {
    renderPoiCreationForm();
    fillValidPoiForm();

    fireEvent.change(screen.getByLabelText("Ciudad"), {
        target: { value: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" }
    });

    expect(await screen.findByText("La ciudad no puede superar los 30 caracteres")).toBeInTheDocument();
});

// ------------------ Address Validation Tests ------------------------------

test("POI with an empty address should render an error", async () => {
    renderPoiCreationForm();
    fillValidPoiForm();

    fireEvent.change(screen.getByLabelText("Dirección"), {
        target: { value: "a" }
    });
    fireEvent.change(screen.getByLabelText("Dirección"), {
        target: { value: "" }
    });

    expect(await screen.findByText("La dirección es obligatoria")).toBeInTheDocument();
});

test("POI with an address longer than 60 characters should render an error", async () => {
    renderPoiCreationForm();
    fillValidPoiForm();

    fireEvent.change(screen.getByLabelText("Dirección"), {
        target: { value: "a".repeat(61) }
    });

    expect(await screen.findByText("La dirección no puede superar los 60 caracteres")).toBeInTheDocument();
});

// ------------------ Coordinates Validation Tests --------------------------

test("POI with an empty latitude should render an error", async () => {
    renderPoiCreationForm();
    fillValidPoiForm();

    fireEvent.change(screen.getByLabelText("Latitud"), {
        target: { value: "a" }
    });
    fireEvent.change(screen.getByLabelText("Latitud"), {
        target: { value: "" }
    });

    expect(await screen.findByText("La latitud es obligatoria")).toBeInTheDocument();
});

test("POI with an invalid latitude should render an error", async () => {
    renderPoiCreationForm();
    fillValidPoiForm();

    fireEvent.change(screen.getByLabelText("Latitud"), {
        target: { value: "invalid" }
    });

    expect(await screen.findByText("Debe ser un número decimal (ej: 40.4168)")).toBeInTheDocument();
});

test("POI with an empty longitude should render an error", async () => {
    renderPoiCreationForm();
    fillValidPoiForm();

    fireEvent.change(screen.getByLabelText("Longitud"), {
        target: { value: "a" }
    });
    fireEvent.change(screen.getByLabelText("Longitud"), {
        target: { value: "" }
    });

    expect(await screen.findByText("La longitud es obligatoria")).toBeInTheDocument();
});

test("POI with an invalid longitude should render an error", async () => {
    renderPoiCreationForm();
    fillValidPoiForm();

    fireEvent.change(screen.getByLabelText("Longitud"), {
        target: { value: "invalid" }
    });

    expect(await screen.findByText("Debe ser un número decimal (ej: -3.7038)")).toBeInTheDocument();
});