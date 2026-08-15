import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import profanity from "allprofanity";
import { verify } from 'node:crypto';
import { createAccessToken,createRefreshToken,setAccessTokenCookie,setRefreshTokenCookie,setAuthCookies, } from "../libs/auth.js";
import bcrypt from "bcrypt";
import PasswordSession from "../models/PasswordSession.js";
import { randomUUID } from "node:crypto";

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
export const logout = (req, res) => {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.json({
        success: true,
    });
};

export function checkValidation(
    req,
    res,
    next
) {
    const result = validationResult(req);

    if (!result.isEmpty()) {
        return res.status(400).json({
            errors: result.array()
        });
    }

    next();
}

export async function authenticate(req, res, next) {
    const token = req.cookies.accessToken;

    if (!token) {
        return res.status(401).json({
            message: "Chưa đăng nhập"
        });
    }

    try {
        // =========================
        // 1. Access token còn hạn
        // =========================
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET_ACCESS
        );

        req.user = decoded;
        console.log("access con han")
        return next();
    } catch (error) {

        // =========================
        // 2. Access token hết hạn
        // =========================
        if (error.name === "TokenExpiredError") {

            try {
                const refresh = req.cookies.refreshToken;

                if (!refresh) {
                    return res.status(401).json({
                        message: "Access token hết hạn"
                    });
                }

                // Verify refresh token
                const decodedRefresh = jwt.verify(
                    refresh,
                    process.env.JWT_SECRET_REFRESH
                );

                // =========================
                // 3. Tìm session tương ứng
                // =========================
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

                // =========================
                // 4. Rotation refresh token
                // =========================
                const now = new Date();

                // const IDLE_TIMEOUT = 30 * 24 * 60 * 60 * 1000;
                const IDLE_TIMEOUT =  30 * 1000;

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

                if (now >= session.absoluteExpiresAt) {
                    session.revoked = true;
                    await session.save();

                    return res.status(401).json({
                        message: "Phiên đăng nhập đã hết hạn"
                    });
                }
                // Kiểm tra refresh token hiện tại có đúng session không
                const isValidRefreshToken = await bcrypt.compare(
                    refresh,
                    session.refreshTokenHash
                );

                if (!isValidRefreshToken) {
                    session.revoked = true;
                    await session.save();

                    return res.status(401).json({
                        message: "Refresh token không hợp lệ"
                    });
                }
                // Revoke session cũ
                session.revoked = true;
                await session.save();

                // Tạo sessionId mới
                const newSessionId = randomUUID();

                // Tạo token mới
                const newAccessToken = createAccessToken(
                    decodedRefresh.userId
                );

                const newRefreshToken = createRefreshToken(
                    decodedRefresh.userId,
                    newSessionId
                );

                // Hash refresh token mới
                const newRefreshTokenHash = await bcrypt.hash(
                    newRefreshToken,
                    10
                );

                // Tạo PasswordSession mới
                await PasswordSession.create({
                    sessionId: newSessionId,
                    userId: decodedRefresh.userId,
                    refreshTokenHash: newRefreshTokenHash,

                    lastActivityAt: now,
                    absoluteExpiresAt: session.absoluteExpiresAt,

                    revoked: false
                });

                // Ghi cookie mới
                setAuthCookies(
                    res,
                    newAccessToken,
                    newRefreshToken
                );

                // Cho request tiếp tục
                req.user = {
                    userId: decodedRefresh.userId
                };

                console.log("Đã rotation refresh token");

                return next();
            } catch (err) {
                console.error(err);

                return res.status(401).json({
                    message: "Refresh token không hợp lệ"
                });
            }
        }

        // =========================
        // 3. Access token sai
        // =========================
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                message: "Token không hợp lệ"
            });
        }

        return res.status(401).json({
            message: "Xác thực thất bại"
        });
    }
}

