import { API } from "../config/api";
import type { ChangePass } from "../types/TypeAuth";


export async function GetProfile() {
    return await fetch(`${API}/profile`, {
        credentials: "include",
    });
}
export async function changePassword(data: ChangePass) {
    return await fetch(`${API}/profile/change-password`,{
        method: "PUT",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
}