import { Router } from "express";
import * as UserController from "../controllers/userControllers.js";
import {
    registerValidation,
    checkValidation,
    loginValidation,
    verifyOtpValidation,
    authenticate,
    changePasswordValidation,
    logout
} from "../middlewares/userValidation.js";

import {
    registerLimiter,
    loginLimiter,
    otpLimiter,
    changePasswordLimiter
} from "../middlewares/rateLimit.js";

import User from "../models/User.js";

const router = Router();

router.post(
    "/register",
    registerLimiter,
    registerValidation,
    checkValidation,
    UserController.register
);

router.post(
    "/verifyOtp",
    otpLimiter,
    verifyOtpValidation,
    checkValidation,
    UserController.checkAction
);

router.post(
    "/login",
    loginLimiter,
    loginValidation,
    checkValidation,
    UserController.login
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
    UserController.ChangePassword
);

export default router;