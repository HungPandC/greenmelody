import jwt from "jsonwebtoken";

export function generateTokens(userId) {
    const accessToken = jwt.sign(
        { userId },
        process.env.JWT_SECRET_ACCESS,
        { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
        { userId },
        process.env.JWT_SECRET_REFRESH,
        { expiresIn: "30d" }
    );

    return {
        accessToken,
        refreshToken,
    };
}

export function setAuthCookies(res, accessToken, refreshToken) {
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 15 * 60 * 1000,
    });
}