const base_url = "/api/tour";

export async function getAllTours() {
    const url = `${base_url}/all`;

    const response = await fetch(url);

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
    }

    return await response.json();
}