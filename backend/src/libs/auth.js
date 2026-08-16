import jwt from "jsonwebtoken";

export const createAccessToken = (userId) => {
    return jwt.sign(
        {
            userId,
            type: "access"
        },
        process.env.JWT_SECRET_ACCESS,
        {
            expiresIn: "20s"
        }
    );
};

export const createRefreshToken = (userId, sessionId) => {
    return jwt.sign(
        {
            userId,
            sessionId,
            type: "refresh"
        },
        process.env.JWT_SECRET_REFRESH,
        {
            expiresIn: "3m"
        }
    );
};

export function generateTokens(userId,sessionId) {
    const accessToken = createAccessToken(userId);
    const refreshToken = createRefreshToken(userId,sessionId);

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
