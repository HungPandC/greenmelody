import { z } from "zod";
import { createAccessToken,createRefreshToken,setAuthCookies, } from "../libs/auth.lib.js";
import bcrypt from "bcrypt";
import PasswordSession from "../models/passwordSession.model.js";
import { randomUUID } from "node:crypto";
import { RequestHandler } from "express";
import { AccessTokenPayload,RefreshTokenPayload } from "../types/typeAuth.js";
import jwt from "jsonwebtoken";
// Đường dẫn này chỉnh lại cho đúng vị trí thật của usernameModeration.ts
// so với file này.
import { moderateUsername } from "../middlewares/usernameModeration/usernameModeration.js";

// =====================================================
// Schemas riêng từng field
// =====================================================

const usernameSchema = z
    .string({ error: "Tên phải là chuỗi" })
    .trim()
    .min(3, "Tên phải từ 3-30 ký tự")
    .max(30, "Tên phải từ 3-30 ký tự")
    .regex(
        /^[A-Za-z0-9_ ]+$/,
        "Tên chỉ được chứa chữ, số, khoảng trắng và _"
    )
    .refine(value => !value.startsWith("_"), "Không được bắt đầu bằng _")
    .refine(value => !value.endsWith("_"), "Không được kết thúc bằng _")
    .refine(value => !/_{2,}/.test(value), "Không được có nhiều dấu _ liên tiếp")
    .refine(
        value => moderateUsername(value).decision !== "REJECT",
        "Tên chứa từ không phù hợp"
    );

const emailSchema = z
    .string({ error: "Email phải là chuỗi" })
    .trim()
    .toLowerCase()
    .min(1, "Email không được để trống")
    .max(254, "Email quá dài")
    .email("Email không hợp lệ")
    .refine(value => !/\s/.test(value), "Email không được chứa khoảng trắng");

// Mật khẩu mạnh - dùng cho register và reset password
const strongPasswordSchema = z
    .string({ error: "Mật khẩu phải là chuỗi" })
    .min(1, "Mật khẩu không được để trống")
    .min(8, "Mật khẩu phải từ 8-64 ký tự")
    .max(64, "Mật khẩu phải từ 8-64 ký tự")
    .refine(value => /[a-z]/.test(value), "Phải có ít nhất 1 chữ thường")
    .refine(value => /[A-Z]/.test(value), "Phải có ít nhất 1 chữ hoa")
    .refine(value => /[0-9]/.test(value), "Phải có ít nhất 1 số")
    .refine(
        value => /[!@#$%^&*()_\-+=\[\]{};:'",.<>/?\\|`~]/.test(value),
        "Phải có ít nhất 1 ký tự đặc biệt"
    )
    .refine(value => !/\s/.test(value), "Mật khẩu không được chứa khoảng trắng");

// Mật khẩu login - chỉ check tồn tại + độ dài, không check độ mạnh
// (mật khẩu cũ có thể được tạo từ trước khi có rule mạnh hơn)
const loginPasswordSchema = z
    .string({ error: "Mật khẩu phải là chuỗi" })
    .min(1, "Mật khẩu không được để trống")
    .max(200, "Mật khẩu quá dài");

const otpSchema = z
    .string({ error: "OTP phải là chuỗi" })
    .trim()
    .regex(/^\d{6}$/, "OTP phải gồm đúng 6 chữ số");

// =====================================================
// Schema tổng hợp từng route + check passwordAgain khớp password
// =====================================================

const registerSchema = z
    .object({
        username: usernameSchema,
        email: emailSchema,
        password: strongPasswordSchema,
        password_again: z.string({ error: "Vui lòng xác nhận mật khẩu" }),
    })
    .refine(data => data.password_again === data.password, {
        message: "Mật khẩu xác nhận không khớp",
        path: ["password_again"],
    });

const loginSchema = z.object({
    email: emailSchema,
    password: loginPasswordSchema,
});

const verifyOtpSchema = z.object({
    otp: otpSchema,
});

const forgotPasswordSchema = z.object({
    email: emailSchema,
});

// Lưu ý: bản express-validator cũ dùng loginPasswordValidator (chỉ check
// độ dài) cho reset password, không check độ mạnh như register - có vẻ là
// sót chứ không phải cố ý, nên ở đây đổi sang strongPasswordSchema cho
// đúng ý nghĩa "đặt mật khẩu mới".
const resetPasswordSchema = z
    .object({
        password: strongPasswordSchema,
        passwordAgain: z.string({ error: "Vui lòng xác nhận mật khẩu" }),
    })
    .refine(data => data.passwordAgain === data.password, {
        message: "Mật khẩu xác nhận không khớp",
        path: ["passwordAgain"],
    });

// =====================================================
// Middleware factory - nối zod schema vào Express
// =====================================================

function validateBody(schema: z.ZodType): RequestHandler {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({
                errors: result.error.issues.map(issue => ({
                    path: issue.path.join("."),
                    msg: issue.message,
                })),
            });
        }

        req.body = result.data;
        next();
    };
}

// =====================================================
// Export - giữ tên cũ, vẫn là mảng để chỗ dùng ...spread không vỡ
// =====================================================

export const registerValidation = [validateBody(registerSchema)];
export const loginValidation = [validateBody(loginSchema)];
export const verifyOtpValidation = [validateBody(verifyOtpSchema)];
export const forgotPasswordValidation = [validateBody(forgotPasswordSchema)];
export const resetPasswordValidation = [validateBody(resetPasswordSchema)];

export const logout: RequestHandler = (req, res) => {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.json({
        success: true,
    });
};

// =====================================================
// Authenticate - GIỮ NGUYÊN, không đụng vào
// =====================================================

export const authenticate: RequestHandler = async (req, res, next) => {

    const token = req.cookies.accessToken;

    if (!token) {
        return res.status(401).json({
            message: "Chưa đăng nhập"
        });
    }

    try {

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

        if (error instanceof jwt.TokenExpiredError) {

            try {

                const refresh = req.cookies.refreshToken;

                if (!refresh) {
                    return res.status(401).json({
                        message: "Access token hết hạn"
                    });
                }

                const decodedRefresh = jwt.verify(
                    refresh,
                    process.env.JWT_SECRET_REFRESH as string
                ) as RefreshTokenPayload;

                if (decodedRefresh.type !== "refresh") {
                    return res.status(401).json({
                        message: "Refresh token không hợp lệ"
                    });
                }

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

                const now = new Date();

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

                if (now >= session.absoluteExpiresAt) {

                    session.revoked = true;
                    await session.save();

                    return res.status(401).json({
                        message: "Phiên đăng nhập đã hết hạn"
                    });
                }

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

                session.revoked = true;
                await session.save();

                const newSessionId = randomUUID();

                const newAccessToken = createAccessToken(
                    decodedRefresh.userId
                );

                const newRefreshToken = createRefreshToken({
                    userId: decodedRefresh.userId,
                    sessionId: newSessionId
                });

                const newRefreshTokenHash = await bcrypt.hash(
                    newRefreshToken,
                    10
                );

                await PasswordSession.create({
                    sessionId: newSessionId,
                    userId: decodedRefresh.userId,
                    refreshTokenHash: newRefreshTokenHash,
                    lastActivityAt: now,
                    absoluteExpiresAt: session.absoluteExpiresAt,
                    revoked: false
                });

                setAuthCookies(
                    res,
                    newAccessToken,
                    newRefreshToken
                );

                req.user = {
                    userId: decodedRefresh.userId,
                    type: "access"
                };

                console.log("Đã rotation refresh token");

                return next();

            } catch (err) {

                if (err instanceof jwt.TokenExpiredError) {
                    return res.status(401).json({
                        message: "Refresh token đã hết hạn"
                    });
                }

                if (err instanceof jwt.TokenExpiredError) {
                    return res.status(401).json({
                        message: "Refresh token không hợp lệ"
                    });
                }

                console.error(err);

                return res.status(401).json({
                    message: "Refresh token không hợp lệ"
                });
            }
        }

        if (error instanceof jwt.TokenExpiredError) {

            return res.status(401).json({
                message: "Token không hợp lệ"
            });
        }

        console.error(error);

        return res.status(401).json({
            message: "Xác thực thất bại"
        });
    }
};