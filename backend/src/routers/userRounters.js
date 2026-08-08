import { Router } from "express";
import {
    registerValidation,
    checkValidation,
    loginValidation,
    verifyOtpValidation,
    authenticate,
    logout,
    forgotPasswordValidation,
} from "../middlewares/userValidation.js";

import {
    registerLimiter,
    loginLimiter,
    sendOtpLimiter,
    verifyOtpLimiter,
    changePasswordLimiter,
    loginEmailLimiter,
} from "../middlewares/rateLimit.js";
import {
    generateCsrfToken,
    doubleCsrfProtection
} from "../middlewares/csrf.js";

import * as authController from "../controllers/authControllers.js";
import * as userController from "../controllers/userControllers.js"

import User from "../models/User.js";
import { loginGoogleController } from "../controllers/googleController.js";

const router = Router();

router.post(
    "/register",
    doubleCsrfProtection,
    registerLimiter,
    registerValidation,
    checkValidation,
    authController.register
);

router.post(
    "/sendOtp",
    doubleCsrfProtection,
    sendOtpLimiter,
    checkValidation,
    authController.sendRegisterOtp
);

router.post(
    "/verifyOtp",
    doubleCsrfProtection,
    verifyOtpLimiter,
    verifyOtpValidation,
    checkValidation,
    authController.verifyRegisterOTP
);

router.post(
    "/login",
    doubleCsrfProtection,
    loginLimiter,
    loginEmailLimiter,
    loginValidation,
    checkValidation,
    authController.login
);

router.post(
    "/logout",
    doubleCsrfProtection,
    logout
);

router.get(
    "/home",
    authenticate,
    async (req, res) => {
        const user = await User.findById(req.user.userId);
        res.json(user);
    }
);

router.get(
    "/profile",
    authenticate,
    (req, res) => {
        res.json({
            user: req.user
        });
    }
);

router.put(
    "/profile/change-password",
    doubleCsrfProtection,
    authenticate,
    changePasswordLimiter,
    checkValidation,
    userController.changePasswordController
);

router.post(
    "/forgot-password",
    doubleCsrfProtection,
    forgotPasswordValidation,
    userController.forgotPasswordController
);

router.post(
    "/send-reset-otp",
    doubleCsrfProtection,
    userController.sendResetOtpController
);

router.post(
    "/verify-reset-otp",
    doubleCsrfProtection,
    verifyOtpValidation,
    userController.verifyResetOtpController
);

router.post(
    "/reset-password",
    doubleCsrfProtection,
    userController.resetPasswordController
);

router.post(
    "/google",
    doubleCsrfProtection,
    loginGoogleController
);

router.get("/csrf-token", (req, res) => {
    const csrfToken = generateCsrfToken(req, res);

    res.json({
        csrfToken
    });
});

export default router;