import { doubleCsrf } from "csrf-csrf";

const {
    generateCsrfToken,
    doubleCsrfProtection
} = doubleCsrf({
    getSecret: () => process.env.CSRF_SECRET,

    cookieName: "csrf_token",

    cookieOptions: {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax"
    },

    getSessionIdentifier: (req) => {
        return req.ip;
    },

    getTokenFromRequest: (req) => {
        return req.headers["x-csrf-token"];
    }
});

export {
    generateCsrfToken,
    doubleCsrfProtection
};