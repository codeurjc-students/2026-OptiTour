const testApiBaseUrl = "https://localhost:443/api/v1";

export const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    (import.meta.env.MODE === "test" ? testApiBaseUrl : "/api/v1");
