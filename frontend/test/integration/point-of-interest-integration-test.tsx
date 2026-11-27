// @ts-ignore
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { expect, test } from "vitest";
import '@testing-library/jest-dom/vitest';
import PointOfInterestDetail from '../../src/routes/point-of-interest-detail/point-of-interest-detail';
import { loginAs } from "./integration-test-setup";
import POIManagement from "../../src/routes/admin/poi-management/poi-management";
import CreatePointOfInterest from "../../src/routes/admin/create-poi/create-poi";
import POIEdition from "../../src/routes/admin/edit-poi/edit-poi";
import { editPoiById, getPoisByPage } from "../../src/service/point-of-interest-service";

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
    }, { timeout: 10000 });

    const firstPoiCard = screen.getByText("Museo del Prado");
    expect(firstPoiCard).toBeInTheDocument();

    const page2Button = screen.getByRole('button', { name: 'Página 2' });
    fireEvent.click(page2Button);

    expect(await screen.findByText("Catedral y Giralda", {}, { timeout: 10000 })).toBeInTheDocument();
    expect(screen.queryByText("Museo del Prado")).not.toBeInTheDocument();
    expect(container.querySelectorAll('.ot-poi-list-item').length).toBe(10);
    expect(page2Button).toHaveAttribute('aria-current', 'page');
}, 20000);

test('Checks if poi is delete from database correctly', async () => {
    await loginAs("admin@optitour.com", "Admin1234");

    render(
        <MemoryRouter>
            <POIManagement />
        </MemoryRouter>
    );

    const allDetailButtons = await screen.findAllByRole('button', { name: "Ver detalle" });
    const targetUrl = allDetailButtons[0].getAttribute('href')!;

    const allDeleteButtons = await screen.findAllByRole('button', { name: "Eliminar" });
    const firstDeleteButton = allDeleteButtons[0];
    fireEvent.click(firstDeleteButton);

    const confirmButton = await screen.findByRole('button', { name: "Sí, borrar" });
    fireEvent.click(confirmButton);

    expect(await screen.findByText(/Se ha eliminado el siguiente punto de interés/)).toBeInTheDocument();

    cleanup();

    render(
        <MemoryRouter initialEntries={[targetUrl]}>
            <Routes>
                <Route path="/point-of-interest/:id" element={<PointOfInterestDetail />} />
            </Routes>
        </MemoryRouter>
    );

    const errorTitle = await screen.findByText("404: Punto de interés no encontrado");
    expect(errorTitle).toBeInTheDocument();
});

test('Checks if repeated name error card shows in edit poi form', async () => {
    await loginAs("admin@optitour.com", "Admin1234");

    const poisResponse = await getPoisByPage(0, 5);
    const targetPoi = poisResponse.content[0];
    const duplicateName = poisResponse.content[1].name;

    render(
        <MemoryRouter initialEntries={[`/admin/poi/edit/${targetPoi.id}`]}>
            <Routes>
                <Route path="/admin/poi/edit/:id" element={<POIEdition />} />
            </Routes>
        </MemoryRouter>
    );
    const nameField = await screen.findByLabelText("Nombre del punto de interés");
    const submitButton = await screen.findByRole('button', { name: "Editar punto de interés" });

    fireEvent.change(nameField, { target: { value: duplicateName } });
    fireEvent.click(submitButton);

    const errorCard = await screen.findByText(
        "Ya exisite un punto de interés con este nombre. Prueba con otro punto de interés e inténtalo de nuevo"
    );

    expect(errorCard).toBeInTheDocument();
});

test('Checks if poi editing workflow works properly', async () => {
    await loginAs("admin@optitour.com", "Admin1234");

    const poisResponse = await getPoisByPage(0, 5);
    const targetPoi = poisResponse.content[0];
    const originalName = targetPoi.name;

    render(
        <MemoryRouter initialEntries={[`/admin/poi/edit/${targetPoi.id}`]}>
            <Routes>
                <Route path="/admin/poi/edit/:id" element={<POIEdition />} />
                <Route path="/admin/poi" element={<POIManagement />} />
            </Routes>
        </MemoryRouter>
    );

    const nameField = await screen.findByLabelText("Nombre del punto de interés");
    const submitButton = await screen.findByRole('button', { name: "Editar punto de interés" });

    fireEvent.change(nameField, { target: { value: "EDITED" } });
    fireEvent.click(submitButton);

    const modalTitle = await screen.findByText("Punto de interés editado");
    expect(modalTitle).toBeInTheDocument();

    // Restauramos el nombre original para no alterar los demás tests
    await editPoiById(targetPoi.id, {
        name: originalName,
        description: targetPoi.description,
        city: targetPoi.city,
        address: targetPoi.address,
        coords: targetPoi.coords
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