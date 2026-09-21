import type { authDTO } from "../dto/auth-dto";

const base_url = "https://localhost:443/api/v1/auth";

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