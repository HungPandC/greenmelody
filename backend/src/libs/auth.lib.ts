import jwt from "jsonwebtoken";
import { Response } from "express";
type UserSession = {
    userId: string;
    sessionId: string;
};


export const createAccessToken = (userId : string) => {
    return jwt.sign(
        {
            userId,
            type: "access"
        },
        process.env.JWT_SECRET_ACCESS as string,
        {
            expiresIn: "20s"
        }
    );
};

export const createRefreshToken = ({
    userId,
    sessionId
}: UserSession) => {
    return jwt.sign(
        {
            userId,
            sessionId,
            type: "refresh"
        },
        process.env.JWT_SECRET_REFRESH as string,
        {
            expiresIn: "3m"
        }
    );
};

export function generateTokens({
    userId,
    sessionId
}: UserSession) {
    const accessToken = createAccessToken(userId);

    const refreshToken = createRefreshToken({
        userId,
        sessionId
    });

    return {
        accessToken,
        refreshToken
    };
}

export function setAccessTokenCookie(res: Response, accessToken: string) {
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 20 * 1000,
    });
}

export function setRefreshTokenCookie(res: Response, refreshToken: string) {
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 3 * 60 *1000,
    });
}

export function setAuthCookies(res: Response, accessToken : string, refreshToken: string) {
    setRefreshTokenCookie(res, refreshToken);
    setAccessTokenCookie(res, accessToken);
}
