import type { authDTO } from "../dto/auth-dto";
import { API_BASE_URL } from "./api-config";

const base_url = `${API_BASE_URL}/auth`;

export async function login(credentials: authDTO) {
    const url = `${base_url}/login`;

    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(credentials)
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
    }

    return await response.json();
}

export async function getLoggedUser() {
    const url = `${base_url}/logged`;

    const response = await fetch(url, {
        credentials: "include",
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
    }

    return await response.json();
}

export async function logout() {
    const url = `${base_url}/logout`;

    const response = await fetch(url, {
        method: "POST",
        credentials: "include"
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
    }

    return await response.json();
}