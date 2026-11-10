import { ApiError } from "./api-error";
import { API_BASE_URL } from "./api-config";

const base_url = `${API_BASE_URL}/point-of-interest`;

export async function getPoiById(id: number) {
    const url = `${base_url}/${id}`;

    const response = await fetch(url);

    if (!response.ok) {
        const errorData = await response.json();
        throw new ApiError(errorData.message, errorData.status, errorData.error);
    }

    return await response.json();
}

export async function getPoisByPage(page: number, size: number) {
    const url = `${base_url}/?page=${page}&size=${size}`;

    const response = await fetch(url, {
        credentials: "include"
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new ApiError(errorData.message, errorData.status, errorData.error);
    }

    return await response.json();
}