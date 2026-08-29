import { doubleCsrf } from "csrf-csrf";
import { Request } from "express";
const {
    generateCsrfToken,
    doubleCsrfProtection
} = doubleCsrf({
    getSecret: () => process.env.CSRF_SECRET as string,

    cookieName: "csrf_token",

    cookieOptions: {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax"
    },

    getSessionIdentifier: (req: Request): string => {
        return req.ip ?? "unknown";
    },

    getCsrfTokenFromRequest: (req: Request): string => {
        const token = req.headers["x-csrf-token"];
        return Array.isArray(token) ? token[0] ?? "" : token ?? "";
    }
});

export {
    generateCsrfToken,
    doubleCsrfProtection
};