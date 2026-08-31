import { useEffect, useState } from "react";
import type { TourDTO } from "../dto/TourDTO";
import { getAllTours } from "../service/tour_service";

export default function Index() {

    const [tours, setTours] = useState<TourDTO[]>();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleLoadTours() {
        setLoading(true);

        try {
            const response = await getAllTours();
            setTours(response);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : "No se han podido cargar los tour.");
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        handleLoadTours();
    }, []);

    return (
        <>
            <h1>OptiTour</h1>
            {loading && <p>Cargando...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <ul>
                {tours?.map((tour) => (
                    <li key={tour.id} id={String(tour.id)}>
                        <h2>{tour.id}: {tour.name}</h2>
                        <p>{tour.description}</p>
                    </li>
                ))}
            </ul>
        </>
    );
}