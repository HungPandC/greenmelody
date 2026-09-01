import { body, validationResult } from "express-validator";
import profanity from "allprofanity";
import { createAccessToken,createRefreshToken,setAuthCookies, } from "../libs/auth.lib.js";
import bcrypt from "bcrypt";
import PasswordSession from "../models/passwordSession.model.js";
import { randomUUID } from "node:crypto";
import { RequestHandler } from "express";
import { AccessTokenPayload,RefreshTokenPayload } from "../types/typeAuth.js";
import jwt, {
    TokenExpiredError,
    JsonWebTokenError
} from "jsonwebtoken";

const bannedWords = [
    "admin",
    "administrator",
    "root",
    "support",
    "staff",
    "owner",
    "system",
    "api",
];
// Common validators
const usernameValidator = () =>
    body("username")
        .isString()
        .withMessage("Tên phải là chuỗi")
        .trim()
        .notEmpty()
        .withMessage("Tên không được để trống")

        .isLength({ min: 3, max: 30 })
        .withMessage("Tên phải từ 3-30 ký tự")

        .matches(/^[A-Za-z0-9_ ]+$/)
        .withMessage("Tên chỉ được chứa chữ, số, khoảng trắng và _")

        .custom(value => {
            if (value.startsWith("_")) {
                throw new Error("Không được bắt đầu bằng _");
            }

            if (value.endsWith("_")) {
                throw new Error("Không được kết thúc bằng _");
            }

            if (/_{2,}/.test(value)) {
                throw new Error("Không được có nhiều dấu _ liên tiếp");
            }

            return true;
        })

        .custom(value => {
            if (bannedWords.some(word => value.toLowerCase().includes(word))) {
                throw new Error("Tên chứa từ cấm");
            }

            return true;
        })

        .custom(value => {
            if (profanity.check(value)) {
                throw new Error("Tên chứa từ không phù hợp");
            }

            return true;
});

const emailValidator = () =>
    body("email")
        .isString()
        .withMessage("Email phải là chuỗi")
        .trim()
        .normalizeEmail()
        .notEmpty()
        .withMessage("Email không được để trống")
        .isEmail()
        .withMessage("Email không hợp lệ")
        .isLength({ max: 254 })
        .withMessage("Email quá dài")

        .custom(value => {
            if (/\s/.test(value)) {
                throw new Error("Email không được chứa khoảng trắng");
            }

            return true;
});

const passwordValidator = (field = "password") =>
    body(field)
        .isString()
        .withMessage("Mật khẩu phải là chuỗi")
        .notEmpty()
        .withMessage("Mật khẩu không được để trống")

        .isLength({ min: 8, max: 64 })
        .withMessage("Mật khẩu phải từ 8-64 ký tự")

        .matches(/[a-z]/)
        .withMessage("Phải có ít nhất 1 chữ thường")

        .matches(/[A-Z]/)
        .withMessage("Phải có ít nhất 1 chữ hoa")

        .matches(/[0-9]/)
        .withMessage("Phải có ít nhất 1 số")

        .matches(/[!@#$%^&*()_\-+=\[\]{};:'",.<>/?\\|`~]/)
        .withMessage("Phải có ít nhất 1 ký tự đặc biệt")

        .custom(value => {
            if (/\s/.test(value)) {
                throw new Error("Mật khẩu không được chứa khoảng trắng");
            }

    return true;
});
const passwordAgainValidator = (field = "passwordAgain",target = "password") =>
    body(field)
        .notEmpty()
        .withMessage("Vui lòng xác nhận mật khẩu")

        .custom((value, { req }) => {
            if (value !== req.body[target]) {
                throw new Error("Mật khẩu xác nhận không khớp");
            }
    return true;
});

const loginPasswordValidator = () =>
    body("password")
        .notEmpty()
        .withMessage("Mật khẩu không được để trống")

        .isLength({ max: 200 })
        .withMessage("Mật khẩu quá dài");

const otpValidator = () =>
    body("otp")
        .isString()
        .withMessage("OTP phải là chuỗi")
        .trim()
        .notEmpty()
        .matches(/^\d{6}$/)
        .withMessage("OTP phải gồm đúng 6 chữ số");
// REGISTER
export const registerValidation = [
    usernameValidator(),
    emailValidator(),
    passwordValidator(),
    passwordAgainValidator("password_again"),
];

// LOGIN
export const loginValidation = [
    emailValidator(),
    loginPasswordValidator(),
];

// VERIFY OTP
export const verifyOtpValidation = [
    otpValidator(),
];
export const forgotPasswordValidation = [
    emailValidator(),
]
export const resetPasswordValidation = [
    loginPasswordValidator(),
    passwordAgainValidator(),
]
export const logout: RequestHandler = (req, res) => {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.json({
        success: true,
    });
};

export const checkValidation : RequestHandler = (
    req,
    res,
    next
) => {
    const result = validationResult(req);

    if (!result.isEmpty()) {
        return res.status(400).json({
            errors: result.array()
        });
    }

    next();
}
// =====================================================
// Authenticate
// =====================================================

export const authenticate: RequestHandler = async (req, res, next) => {

    const token = req.cookies.accessToken;

    if (!token) {
        return res.status(401).json({
            message: "Chưa đăng nhập"
        });
    }

    try {

        // =================================================
        // 1. Access token còn hạn
        // =================================================

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET_ACCESS as string
        ) as AccessTokenPayload;

        if (decoded.type !== "access") {
            return res.status(401).json({
                message: "Token không hợp lệ"
            });
        }

        req.user = decoded;

        return next();

    } catch (error) {

        // =================================================
        // 2. Access token hết hạn
        // =================================================

        if (error instanceof TokenExpiredError) {

            try {

                const refresh = req.cookies.refreshToken;

                if (!refresh) {
                    return res.status(401).json({
                        message: "Access token hết hạn"
                    });
                }

                // =================================================
                // Verify refresh token
                // =================================================

                const decodedRefresh = jwt.verify(
                    refresh,
                    process.env.JWT_SECRET_REFRESH as string
                ) as RefreshTokenPayload;

                if (decodedRefresh.type !== "refresh") {
                    return res.status(401).json({
                        message: "Refresh token không hợp lệ"
                    });
                }

                // =================================================
                // 3. Tìm session tương ứng
                // =================================================

                const session = await PasswordSession.findOne({
                    sessionId: decodedRefresh.sessionId,
                    userId: decodedRefresh.userId,
                    revoked: false
                });

                if (!session) {
                    return res.status(401).json({
                        message: "Session không hợp lệ hoặc đã bị thu hồi"
                    });
                }

                // =================================================
                // 4. Rotation refresh token
                // =================================================

                const now = new Date();

                // 30 giây để test
                // Sau này có thể đổi thành:
                // const IDLE_TIMEOUT = 30 * 24 * 60 * 60 * 1000;

                const IDLE_TIMEOUT = 30 * 1000;

                if (
                    now.getTime() - session.lastActivityAt.getTime()
                    >= IDLE_TIMEOUT
                ) {

                    session.revoked = true;
                    await session.save();

                    return res.status(401).json({
                        message: "Phiên đăng nhập đã hết hạn do không hoạt động"
                    });
                }

                // =================================================
                // Absolute expiration
                // =================================================

                if (now >= session.absoluteExpiresAt) {

                    session.revoked = true;
                    await session.save();

                    return res.status(401).json({
                        message: "Phiên đăng nhập đã hết hạn"
                    });
                }

                // =================================================
                // Kiểm tra refresh token hiện tại
                // =================================================

                const isValidRefreshToken = await bcrypt.compare(
                    refresh,
                    session.refreshTokenHash as string
                );

                if (!isValidRefreshToken) {

                    session.revoked = true;
                    await session.save();

                    return res.status(401).json({
                        message: "Refresh token không hợp lệ"
                    });
                }

                // =================================================
                // Revoke session cũ
                // =================================================

                session.revoked = true;
                await session.save();

                // =================================================
                // Tạo sessionId mới
                // =================================================

                const newSessionId = randomUUID();

                // =================================================
                // Tạo token mới
                // =================================================

                const newAccessToken = createAccessToken(
                    decodedRefresh.userId
                );

                const newRefreshToken = createRefreshToken({
                    userId: decodedRefresh.userId,
                    sessionId: newSessionId
                });

                // =================================================
                // Hash refresh token mới
                // =================================================

                const newRefreshTokenHash = await bcrypt.hash(
                    newRefreshToken,
                    10
                );

                // =================================================
                // Tạo PasswordSession mới
                // =================================================

                await PasswordSession.create({
                    sessionId: newSessionId,
                    userId: decodedRefresh.userId,
                    refreshTokenHash: newRefreshTokenHash,
                    lastActivityAt: now,
                    absoluteExpiresAt: session.absoluteExpiresAt,
                    revoked: false
                });

                // =================================================
                // Ghi cookie mới
                // =================================================

                setAuthCookies(
                    res,
                    newAccessToken,
                    newRefreshToken
                );

                // =================================================
                // Cho request tiếp tục
                // =================================================

                req.user = {
                    userId: decodedRefresh.userId,
                    type: "access"
                };

                console.log("Đã rotation refresh token");

                return next();

            } catch (err) {

                // Refresh token hết hạn
                if (err instanceof TokenExpiredError) {
                    return res.status(401).json({
                        message: "Refresh token đã hết hạn"
                    });
                }

                // Refresh token không hợp lệ
                if (err instanceof JsonWebTokenError) {
                    return res.status(401).json({
                        message: "Refresh token không hợp lệ"
                    });
                }

                // Lỗi không xác định
                console.error(err);

                return res.status(401).json({
                    message: "Refresh token không hợp lệ"
                });
            }
        }

        // =================================================
        // 3. Access token sai
        // =================================================

        if (error instanceof JsonWebTokenError) {

            return res.status(401).json({
                message: "Token không hợp lệ"
            });
        }

        // =================================================
        // 4. Lỗi không xác định
        // =================================================

        console.error(error);

        return res.status(401).json({
            message: "Xác thực thất bại"
        });
    }
};
