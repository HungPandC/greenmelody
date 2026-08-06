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
    otpLimiter,
    changePasswordLimiter
} from "../middlewares/rateLimit.js";

import * as authController from "../controllers/authControllers.js";
import * as userController from "../controllers/userControllers.js"

import User from "../models/User.js";
import { loginGoogleController } from "../controllers/googleController.js";

const router = Router();

router.post(
    "/register",
    registerLimiter,
    registerValidation,
    checkValidation,
    authController.register
);
router.post(
    "/sendOtp",
    otpLimiter,
    checkValidation,
    authController.sendRegisterOtp
);
router.post(
    "/verifyOtp",
    otpLimiter,
    verifyOtpValidation,
    checkValidation,
    authController.verifyRegisterOTP
);
router.post(
    "/login",
    loginLimiter,
    loginValidation,
    checkValidation,
    authController.login
);
router.post(
    "/logout",
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
    authenticate,
    changePasswordLimiter,
    checkValidation,
    userController.ChangePassword
);
router.post(
    "/forgot-password",
    forgotPasswordValidation,
    userController.forgotPasswordController
)
router.post(
    "/send-reset-otp",
    userController.sendResetOtpController,
)
router.post(
    "/verify-reset-otp",
    verifyOtpValidation,
    userController.verifyResetOtpController
)
router.post(
    "/reset-password",
    userController.resetPasswordController
)
router.post(
    "/google",
    loginGoogleController,
)
export default router;