const API_BASE_URL = (
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"
).replace(/\/$/, "");

export async function apiRequest(path, options = {}) {
    const token = localStorage.getItem("ticketly_token");
    const headers = new Headers(options.headers);

    if (options.body && !headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
    }

    if (token && !headers.has("Authorization")) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    let response;

    try {
        response = await fetch(`${API_BASE_URL}${path}`, {
            ...options,
            headers
        });
    } catch {
        throw new Error(
            `Unable to connect to the Ticketly server at ${API_BASE_URL}. ` +
            "Start the backend and confirm the API URL is correct."
        );
    }

    const contentType = response.headers.get("content-type") || "";
    let data = null;

    if (contentType.includes("application/json")) {
        try {
            data = await response.json();
        } catch {
            throw new Error("The server returned an invalid JSON response.");
        }
    }

    if (!response.ok) {
        throw new Error(data?.message || `Request failed (${response.status}).`);
    }

    return data;
}
