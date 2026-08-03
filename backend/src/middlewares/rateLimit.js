import rateLimit from "express-rate-limit";

export const loginLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 phút
    limit: 10,

    message: {
        message: "Bạn đã thử đăng nhập quá nhiều lần. Vui lòng thử lại sau."
    },

    standardHeaders: true,
    legacyHeaders: false,
});

export const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 giờ
    limit: 5,

    message: {
        message: "Bạn đã đăng ký quá nhiều lần. Vui lòng thử lại sau."
    },

    standardHeaders: true,
    legacyHeaders: false,
});

export const otpLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 phút
    limit: 2,

    message: {
        message: "Vui lòng đợi 1 phút trước khi gửi lại OTP."
    },

    standardHeaders: true,
    legacyHeaders: false,
});

export const changePasswordLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 phút
    limit: 5,

    message: {
        message: "Bạn đã đổi mật khẩu quá nhiều lần. Vui lòng thử lại sau."
    },

    standardHeaders: true,
    legacyHeaders: false,
});