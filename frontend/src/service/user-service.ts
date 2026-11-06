import { API_BASE_URL } from "./api-config";
import type { UserCreateDTO } from "../dto/user-create-dto";
import type PasswordDTO from "../dto/password-dto";
import type UserEditDTO from "../dto/user-edit-dto";
import type { UserDTO } from "../dto/user-dto";

const base_url = `${API_BASE_URL}`;

export async function signup(newUser: UserCreateDTO) {
    const url = `${base_url}/user/`

    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser)
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
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

export async function getAllUsers() {
    const url = `${base_url}/user/all`;

    const response = await fetch(url, {
        credentials: "include"
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
    }

    return await response.json();
}

export async function changeIsUserBanned(id: number) {
    const url = `${base_url}/user/${id}/ban`;

    const response = await fetch(url, {
        method: 'PUT',
        credentials: "include"
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
    }

    return response.json();
}

export async function getUserById(id: number) {
    const url = `${base_url}/user/${id}`;

    const response = await fetch(url, {
        credentials: "include"
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
    }

    return response.json();
}

export async function deleteloggedUser(password: PasswordDTO) {
    const url = `${base_url}/user/`;

    const response = await fetch(url, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(password),
        credentials: "include"
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
    }

    return response.json();
}

export async function editLoggedUser(body: UserEditDTO): Promise<UserDTO> {
    const url = `${base_url}/user/`;

    const response = await fetch(url, {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        method: "PUT",
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
    }

    return response.json();
}