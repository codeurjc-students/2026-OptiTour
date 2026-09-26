import type { TourDTO } from "../dto/tour-dto";
import type { PageResponse } from "../routes/page-response";

const base_url = import.meta.env.VITE_API_BASE_URL || "https://localhost:443/api/v1";
const base_tour_url = 'tour';

export async function getAllTours() {
    const url = `${base_url}/${base_tour_url}/all`;

    const response = await fetch(url);

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
    }

    return await response.json();
}

export async function getToursByPage(page: number, size: number): Promise<PageResponse<TourDTO>> {
    const url = `${base_url}/${base_tour_url}/?page=${page}&size=${size}`;

    const response = await fetch(url);

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
    }

    return await response.json();
}