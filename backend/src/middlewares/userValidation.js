// REGISTER
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import profanity from "allprofanity";
import { verify } from 'node:crypto';

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

export const registerValidation = [
    // Username
    body("username")
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
            if (
                bannedWords.some(word =>
                    value.toLowerCase().includes(word)
                )
            ) {
                throw new Error("Tên chứa từ cấm");
            }

            return true;
        })

        .custom(value => {
            if (profanity.check(value)) {
                throw new Error("Tên chứa từ không phù hợp");
            }

            return true;
        }),

    // Email
    body("email")
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
        }),

    // Password
    body("password")
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
        }),
];
// LOGIN
export const loginValidation = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email không được để trống")
        .isEmail()
        .withMessage("Email không hợp lệ"),

    body("password")
        .notEmpty()
        .withMessage("Mật khẩu không được để trống")
        .isLength({ max: 200 })
        .withMessage("password is too long"),
];
//  MAIN
export const verifyOtpValidation = [
    body("otp")
    .if(body("action").equals("verifyOTP"))
    .trim()
    .notEmpty()
    .withMessage("OTP không được để trống")
    .matches(/^\d{6}$/)
    .withMessage("OTP phải gồm đúng 6 chữ số"),
]
// authMiddleware.ts

export function authenticate(req, res, next) {
    const token = req.cookies.accessToken;

    if (!token) {
        return res.status(401).json({
            message: "Chưa đăng nhập"
        });
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET_ACCESS
        );

        req.user = decoded;

        next();
    } catch(error) {
        if(error.name === "TokenExpiredError"){
            try {
                const refresh = req.cookies.refreshToken;
                if (!refresh) {
                    return res.status(401).json({
                        message: "access het han"
                    });
                }
                const decodedRefresh = jwt.verify(
                    refresh,
                    process.env.JWT_SECRET_REFRESH
                );// cai nay co thong giong id
                const accessToken = jwt.sign(
                    { userId: decodedRefresh.userId },
                    process.env.JWT_SECRET_ACCESS,
                    { expiresIn: "15m" }
                );
                res.cookie("accessToken", accessToken, {
                    httpOnly: true,
                    secure: false,
                    sameSite: "lax",
                    maxAge: 15 * 60 * 1000,
                });
                req.user = decodedRefresh;

                next();
            } catch (err) {
                return res.status(401).json({
                    message: "refresh không hợp lệ"
                });
            }
        }

        else if(error.name === "JsonWebTokenError"){
            return res.status(401).json({
                message: "Token không hợp lệ"
            });
        }
    }
}
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
export const logout = (req, res) => {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.json({
        success: true,
    });
};
export const changePasswordValidation = [
    // Mật khẩu cũ
    body("oldPassword")
        .notEmpty()
        .withMessage("Vui lòng nhập mật khẩu cũ"),

    // Mật khẩu mới
    body("newPassword")
        .notEmpty()
        .withMessage("Mật khẩu mới không được để trống")

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
        }),

    // Nhập lại mật khẩu mới
    body("confirmPassword")
        .notEmpty()
        .withMessage("Vui lòng nhập lại mật khẩu mới")

        .custom((value, { req }) => {
            if (value !== req.body.newPassword) {
                throw new Error("Mật khẩu nhập lại không khớp");
            }
            return true;
        }),
    body("newPassword").custom((value, { req }) => {
    if (value === req.body.oldPassword) {
        throw new Error("Mật khẩu mới phải khác mật khẩu cũ");
    }
    return true;
}),
];
