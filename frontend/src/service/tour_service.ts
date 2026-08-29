const base_url = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:443";
const base_tour_url = 'tour';


export async function getAllTours() {
    const url = `${base_url}/${base_tour_url}/all`;

    console.log(url);

    const response = await fetch(url);

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
    }

    return await response.json();
}