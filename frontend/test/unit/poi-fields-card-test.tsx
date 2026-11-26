import { expect, test, vi } from "vitest";
import '@testing-library/jest-dom/vitest';
import { act, fireEvent, render, screen } from "@testing-library/react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import PoiFieldsCard from "../../src/components/poi-fields-card/poi-fields-card";
import type { PointOfInterestDTO } from "../../src/dto/point-of-interest-dto";
import { poiSchema } from "../../src/schemas/point-of-interest-schema";

const mockPoi: PointOfInterestDTO = {
    id: 1,
    name: "Catedral de la Almudena",
    description: "Catedral emblemática situada en Madrid frente al Palacio Real.",
    city: "Madrid",
    address: "Calle de Bailén, 10",
    coords: "40.4154,-3.7144",
    tours: [],
    images: [{ id: 101 }, { id: 102 }],
    createdAt: "2026-01-01T00:00:00Z"
};

function Wrapper({ poi }: { poi?: PointOfInterestDTO }) {
    const methods = useForm({ mode: "onChange" });
    return (
        <FormProvider {...methods}>
            <form>
                <PoiFieldsCard poi={poi} />
            </form>
        </FormProvider>
    );
}

test("PoiFieldsCard renders empty fields when no POI is provided (creation mode)", () => {
    render(<Wrapper />);

    expect(screen.getByLabelText("Nombre del punto de interés")).toHaveValue("");
    expect(screen.getByLabelText("Descripción")).toHaveValue("");
    expect(screen.getByLabelText("Ciudad")).toHaveValue("");
    expect(screen.getByLabelText("Dirección")).toHaveValue("");
    expect(screen.getByLabelText("Latitud")).toHaveValue("");
    expect(screen.getByLabelText("Longitud")).toHaveValue("");
    expect(screen.getByText("Subir imágenes")).toBeInTheDocument();
});

test("PoiFieldsCard renders populated fields and existing images when POI is provided (edition mode)", async () => {
    render(<Wrapper poi={mockPoi} />);

    expect(screen.getByLabelText("Nombre del punto de interés")).toHaveValue("Catedral de la Almudena");
    expect(screen.getByLabelText("Descripción")).toHaveValue("Catedral emblemática situada en Madrid frente al Palacio Real.");
    expect(screen.getByLabelText("Ciudad")).toHaveValue("Madrid");
    expect(screen.getByLabelText("Dirección")).toHaveValue("Calle de Bailén, 10");
    expect(screen.getByLabelText("Latitud")).toHaveValue("40.4154");
    expect(screen.getByLabelText("Longitud")).toHaveValue("-3.7144");

    expect(screen.getByAltText("Imagen existente 1")).toBeInTheDocument();
    expect(screen.getByAltText("Imagen existente 2")).toBeInTheDocument();
    expect(screen.getByText("+")).toBeInTheDocument();

    const deleteBtn = screen.getByLabelText("Eliminar imagen existente 1");
    await act(async () => {
        fireEvent.click(deleteBtn);
    });
    expect(screen.getByAltText("Imagen existente 1")).toHaveAttribute("src", expect.stringContaining("102"));
    expect(screen.queryByAltText("Imagen existente 2")).not.toBeInTheDocument();
});

function ValidatedWrapper({ poi, onSubmit }: { poi?: PointOfInterestDTO; onSubmit?: (data: any) => void }) {
    const methods = useForm({
        resolver: zodResolver(poiSchema),
        mode: "onChange"
    });
    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit ?? (() => {}))}>
                <PoiFieldsCard poi={poi} />
                <button type="submit">Guardar</button>
            </form>
        </FormProvider>
    );
}

test("Validates form when POI has existing images without requiring new selected images", async () => {
    const handleSubmit = vi.fn();
    render(<ValidatedWrapper poi={mockPoi} onSubmit={handleSubmit} />);

    // Since mockPoi has all required fields + 2 existing images, it should validate and submit
    await act(async () => {
        fireEvent.click(screen.getByRole("button", { name: "Guardar" }));
    });

    expect(screen.queryByText("Debes seleccionar al menos una imagen")).not.toBeInTheDocument();
    expect(handleSubmit).toHaveBeenCalled();
});

test("Shows validation error when all existing images are deleted and no new image is selected", async () => {
    const handleSubmit = vi.fn();
    render(<ValidatedWrapper poi={mockPoi} onSubmit={handleSubmit} />);

    // Delete image 1
    await act(async () => {
        fireEvent.click(screen.getByLabelText("Eliminar imagen existente 1"));
    });
    // Delete remaining existing image
    await act(async () => {
        fireEvent.click(screen.getByLabelText("Eliminar imagen existente 1"));
    });

    // Try submitting
    await act(async () => {
        fireEvent.click(screen.getByRole("button", { name: "Guardar" }));
    });

    expect(await screen.findByText("Debes seleccionar al menos una imagen")).toBeInTheDocument();
    expect(handleSubmit).not.toHaveBeenCalled();

    // Now upload a new image to fix the error
    const testFile = new File(["test image content"], "test.png", { type: "image/png" });
    await act(async () => {
        fireEvent.change(document.getElementById("upload-image")!, {
            target: { files: [testFile] }
        });
    });

    expect(screen.queryByText("Debes seleccionar al menos una imagen")).not.toBeInTheDocument();
});
