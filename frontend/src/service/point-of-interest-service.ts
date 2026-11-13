import { ApiError } from "./api-error";
import { API_BASE_URL } from "./api-config";
import type { PointOfInterestCreateDTO } from "../dto/point-of-interest-create-dto";

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

export async function createPoi(newPoi: PointOfInterestCreateDTO) {
    const url = `${base_url}/`;

    const response = await fetch(url, {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        credentials: "include",
        body: JSON.stringify(newPoi)
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new ApiError(errorData.message, errorData.status, errorData.error);
    }

    return await response.json();
}

export async function uploadPoiUIamges(images: File[], id: number) {
    const url = `${base_url}/${id}/image`;

    const formData = new FormData();

    images.forEach(image => {
        formData.append("file", image)
    });

    const response = await fetch(url, {
        method: "POST",
        credentials: "include",
        body: formData
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new ApiError(errorData.message, errorData.status, errorData.error);
    }

    return await response.json();
}