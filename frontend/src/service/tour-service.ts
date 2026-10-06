import type { TourDTO } from "../dto/tour-dto";
import type { PageResponse } from "../routes/page-response";
import { ApiError } from "./api-error";
import { API_BASE_URL } from "./api-config";

const base_tour_url = 'tour';

export async function getAllTours() {
    const url = `${API_BASE_URL}/${base_tour_url}/all`;

    const response = await fetch(url);

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
    }

    return await response.json();
}

export async function getToursByPage(page: number, size: number): Promise<PageResponse<TourDTO>> {
    const url = `${API_BASE_URL}/${base_tour_url}/?page=${page}&size=${size}`;

    const response = await fetch(url);

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
    }

    return await response.json();
}

export async function getTourById(id: number) {
    const url = `${API_BASE_URL}/${base_tour_url}/${id}`;

    const response = await fetch(url);

    if (!response.ok) {
        const errorData = await response.json();
        throw new ApiError(errorData.message, errorData.status, errorData.error);
    }

    return await response.json();
}