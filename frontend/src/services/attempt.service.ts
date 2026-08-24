import { API } from "../config/api";

export async function startAttempt(csrfToken: string,lessonId: string) {
    return fetch(`${API}/attempt/${lessonId}/start`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": csrfToken,
        },
    });
}
