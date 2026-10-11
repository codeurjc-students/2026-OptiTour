import { API_BASE_URL } from "./api-config";
import type { UserCreateDTO } from "../dto/user-create-dto";

const base_url = `${API_BASE_URL}`;

export async function signup(newUser: UserCreateDTO) {
    const url = `${base_url}/user/`

    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser)
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Registro ${response.status}: ${errorText}`);
    }

    return await response.json();
}

export async function uploadUserImage(image: File, id: number) {
    const formData = new FormData();
    formData.append("file", image);

    const url = `${base_url}/user/${id}/image`;
    const response = await fetch(url, {
        method: "POST",
        credentials: "include",
        body: formData
    });

    return response;
}