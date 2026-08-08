import { API } from "../config/api";
import type { RegisterData } from "../types/TypeAuth";


// LOGOUT
export async function logout(csrfToken: string) {
    return fetch(`${API}/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
            "X-CSRF-Token": csrfToken,
        },
    });
}


// LOGIN
export async function login(
    email: string,
    password: string,
    csrfToken: string
) {
    return await fetch(`${API}/login`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify({
            email,
            password,
        }),
    });
}


// REGISTER
export async function register(
    { username, email, password, password_again }: RegisterData,
    csrfToken: string
) {
    return await fetch(`${API}/register`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify({
            username,
            email,
            password,
            password_again,
        }),
    });
}


// SEND REGISTER OTP
export async function sendRegisterOtp(csrfToken: string) {
    return await fetch(`${API}/sendOtp`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify({
            action: "sendotp",
        }),
    });
}


// VERIFY REGISTER OTP
export async function verifyRegisterOtp(
    otp: string,
    csrfToken: string
) {
    return await fetch(`${API}/verifyOtp`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify({
            action: "verifyotp",
            otp,
        }),
    });
}


// GET PROFILE
// GET không cần CSRF
export async function GetProfile() {
    return await fetch(`${API}/profile`, {
        credentials: "include",
    });
}


// FORGOT PASSWORD
export async function forgotPasswordService(
    email: string,
    csrfToken: string
) {
    return await fetch(`${API}/forgot-password`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify({
            email,
        }),
    });
}


// SEND RESET OTP
export async function sendResetOtpService(csrfToken: string) {
    return await fetch(`${API}/send-reset-otp`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify({}),
    });
}


// VERIFY RESET OTP
export async function verifyResetOtpService(
    otp: string,
    csrfToken: string
) {
    return await fetch(`${API}/verify-reset-otp`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify({
            otp,
        }),
    });
}


// RESET PASSWORD
export async function resetPasswordService(
    password: string,
    passwordAgain: string,
    csrfToken: string
) {
    return await fetch(`${API}/reset-password`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify({
            password,
            passwordAgain,
        }),
    });
}


// GOOGLE LOGIN
export async function googleLoginService(
    idToken: string,
    csrfToken: string
) {
    return await fetch(`${API}/google`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify({
            idToken,
        }),
    });
}


// GET CSRF TOKEN
export async function getCsrfToken() {
    return await fetch(`${API}/csrf-token`, {
        method: "GET",
        credentials: "include",
    });
}