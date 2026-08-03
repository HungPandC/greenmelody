import { API } from "../config/api";
import type { RegisterData } from "../types/TypeAuth"

export async function logout() {
    return fetch(`${API}/logout`, {
        method: "POST",
        credentials: "include",
    });
}
export async function login(email : string, password : string) {
   return await fetch(`${API}/login`,{
        method: "POST",
        credentials: "include",
        headers: {  
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email,
            password,
        }),
    });
}
export async function register({username,email,password,password_again}: RegisterData){
    return await fetch(`${API}/register`, {
        method: "POST",
        credentials: "include",
        headers: {  
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username,
            email,
            password,
            password_again,
        })
    });
}
export async function sendRegisterOtp() {
    return await fetch(`${API}/verifyOtp`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            action : "sendotp"
        })
    });
}
export async function verifyRegisterOtp(otp : string) {
    return await fetch(`${API}/verifyOtp`, {
        method: "POST",
        credentials: "include",
        headers: {  
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            action : "verifyotp",
            otp
        })
    });           
}
export async function GetProfile() {
    return await fetch(`${API}/profile`, {
        credentials: "include",
    });
}
export async function UpdateProfile() {
    
}