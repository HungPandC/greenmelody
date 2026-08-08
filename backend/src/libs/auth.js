import jwt from "jsonwebtoken";

export function createAccessToken(userId) {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET_ACCESS,
        { expiresIn: "30s" }
    );
}

export function createRefreshToken(userId) {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET_REFRESH,
        { expiresIn: "2m" }
    );
}

export function generateTokens(userId) {
    const accessToken = createAccessToken(userId);
    const refreshToken = createRefreshToken(userId);

    return {
        accessToken,
        refreshToken,
    };
}


export function setAccessTokenCookie(res, accessToken) {
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 15 * 60 * 1000,
    });
}

export function setRefreshTokenCookie(res, refreshToken) {
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60 * 1000,
    });
}

export function setAuthCookies(res, accessToken, refreshToken) {
    setRefreshTokenCookie(res, refreshToken);
    setAccessTokenCookie(res, accessToken);
}
