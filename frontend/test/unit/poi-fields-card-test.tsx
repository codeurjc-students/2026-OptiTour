import { expect, test } from "vitest";
import '@testing-library/jest-dom/vitest';
import { render, screen } from "@testing-library/react";
import { FormProvider, useForm } from "react-hook-form";
import PoiFieldsCard from "../../src/components/poi-fields-card/poi-fields-card";
import type { PointOfInterestDTO } from "../../src/dto/point-of-interest-dto";

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

test("PoiFieldsCard renders populated fields when POI is provided (edition mode)", () => {
    render(<Wrapper poi={mockPoi} />);

    expect(screen.getByLabelText("Nombre del punto de interés")).toHaveValue("Catedral de la Almudena");
    expect(screen.getByLabelText("Descripción")).toHaveValue("Catedral emblemática situada en Madrid frente al Palacio Real.");
    expect(screen.getByLabelText("Ciudad")).toHaveValue("Madrid");
    expect(screen.getByLabelText("Dirección")).toHaveValue("Calle de Bailén, 10");
    expect(screen.getByLabelText("Latitud")).toHaveValue("40.4154");
    expect(screen.getByLabelText("Longitud")).toHaveValue("-3.7144");
});
