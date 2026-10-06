import { ApiError } from "./api-error";
import { API_BASE_URL } from "./api-config";

const base_poi_url = 'point-of-interest';

export async function getPoiById(id: number) {
    const url = `${API_BASE_URL}/${base_poi_url}/${id}`;

    const response = await fetch(url);

    if (!response.ok) {
        const errorData = await response.json();
        throw new ApiError(errorData.message, errorData.status, errorData.error);
    }

    return await response.json();
}