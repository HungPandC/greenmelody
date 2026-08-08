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

// Giới hạn gửi OTP
export const sendOtpLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 phút
    limit: 2,

    message: {
        message: "Bạn đã yêu cầu OTP quá nhiều lần. Vui lòng thử lại sau."
    },

    standardHeaders: true,
    legacyHeaders: false,
});


// Giới hạn nhập OTP
export const verifyOtpLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 phút
    limit: 5,

    message: {
        message: "Bạn đã nhập OTP quá nhiều lần. Vui lòng thử lại sau."
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
export const loginEmailLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    limit: 5,

    keyGenerator: (req) => {
        return req.body.email?.toLowerCase().trim() || "unknown";
    },

    message: {
        message: "Email này đã thử đăng nhập quá nhiều lần. Vui lòng thử lại sau."
    },

    standardHeaders: true,
    legacyHeaders: false,
});