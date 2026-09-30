import { ApiError } from "./api-error";

const base_url = import.meta.env.VITE_API_BASE_URL || "https://localhost:443/api/v1";
const base_poi_url = 'point-of-interest';

export async function getPoiById(id: number) {
    const url = `${base_url}/${base_poi_url}/${id}`;

    const response = await fetch(url);

    if (!response.ok) {
        const errorData = await response.json();
        throw new ApiError(errorData.message, errorData.status, errorData.error);
    }

    return await response.json();
}