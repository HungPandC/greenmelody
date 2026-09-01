import { randomInt } from "node:crypto";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import transporter from "../libs/mail.lib.js";
import PendingUser from "../models/pendingUser.model.js";
import { randomUUID } from "node:crypto";
import jwt from "jsonwebtoken";
import { generateTokens, setAuthCookies } from "../libs/auth.lib.js";
import PasswordSession from "../models/passwordSession.model.js";
import { RequestHandler } from "express";


export const register:RequestHandler = async (req, res) => {
    try{
        const { username, email, password, password_again } = req.body;

        if(!username || !password || !email || !password_again){
            return res.status(400).json({message:"ko the thieu username, passsword,email"})
        };
        console.log(password_again,password);
        if (password !== password_again) {
            return res.status(400).json({
                message: "Mật khẩu xác nhận không khớp"
            });
        }

        // Kiểm tra email
        // await User.deleteMany({});
        // await PendingUser.deleteMany({});

        const user = await User.findOne({ email });
        const pendingUser_check = await PendingUser.findOne({ email });

        if (user) {
            await User.deleteMany({});
            return res.status(400).json({
                message: "Email đã tồn tại trong tai khoan hd"
            });
        }
        if (pendingUser_check) {
            await PendingUser.deleteMany({});
            return res.status(400).json({
                message: "Email đã tồn tại trong pending"
            });
        }
        const sessionId = randomUUID();
        
        const hashedPassword = await bcrypt.hash(password, 10);

        // Tạo tài khoản
        const newUser = new PendingUser({
            sessionId,
            username,
            email,
            hashedPassword: hashedPassword,
            expiredAt: new Date(Date.now() + 5 * 60 * 1000)
        });

        await newUser.save();
        res.cookie("otp_session", sessionId, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 5 * 60 * 1000
        });

        res.json({
            success: true
        });
    }catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Lỗi server"
        });
    }
};
export const login:RequestHandler = async (req, res) => {
    const {email, password} = req.body;
    if(!email || !password){
        return res.status(400).json({message:"ko the thieu passsword,email"})
    }
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(401).json({
            success: false,
            message: "Email hoặc mật khẩu không chính xác"
        });
    }

    const isMatch = await bcrypt.compare(
        password,
        user.hashedPassword as string
    );

    if (!isMatch) {
        return res.status(401).json({
            success: false,
            message: "Email hoặc mật khẩu không chính xác"
        });
    }

    const sessionId = randomUUID();


    const { accessToken, refreshToken } =
        generateTokens({
            userId:user._id.toString(), 
            sessionId
        });
    const refreshTokenHash = await bcrypt.hash(
        refreshToken,
        10
    );
    await PasswordSession.create({
        sessionId: sessionId,
        userId: user._id,
        revoked: false,
        lastActivityAt: new Date(
            Date.now()
        ),
        absoluteExpiresAt: new Date(
            // Date.now() + 180 * 24 * 60 * 60 * 1000
            Date.now() + 60 * 1000
        ),
        refreshTokenHash,
    });
    setAuthCookies(
        res,
        accessToken,
        refreshToken
    );
    res.json({
        success: true
    });
}
export const sendRegisterOtp:RequestHandler = async (req, res) => {
    const sessionId = req.cookies.otp_session;

    const user = await PendingUser.findOne({
        sessionId
    });

    if (!user) {
        return res.status(404).json({
            message: "Không tìm thấy người dùng"
        });
    }
    if (!user.expiredAt || user.expiredAt < new Date()) {
        return res.status(400).json({
            message: "Phiên đăng ký đã hết hạn"
        });
    }

    const otp = randomInt(100000, 1000000).toString();

    user.hashedRegisterOTP = await bcrypt.hash(otp, 10);
    user.emailOTPExpires = new Date(
        Date.now() + 2 * 60 * 1000
    );

    await user.save();
    if (!user.email) {
        throw new Error("User email is missing");
    }
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Xác thực tài khoản",
        text: `OTP của bạn là: ${otp}`
    });

    res.json({
        success: true
    });
};
export const verifyRegisterOTP:RequestHandler = async (req, res) => {
    try {
        const { otp } = req.body;
        const sessionId = req.cookies.otp_session;

        if (!sessionId) {
            return res.status(400).json({
                message: "Không có session."
            });
        }

        const data = await PendingUser.findOne({
            sessionId
        });

        if (!data) {
            return res.status(400). json({
                message: "OTP đã hết hạn."
            });
        }
        if (!data.expiredAt || data.expiredAt < new Date()) {
            return res.status(400).json({
                message: "Phiên đăng ký đã hết hạn."
            });
        }

        if (!data.hashedRegisterOTP || !data.emailOTPExpires) {
            return res.status(400).json({
                message: "OTP chưa được gửi."
            });
        }

        if (data.emailOTPExpires < new Date()) {
            return res.status(400).json({
                message: "OTP đã hết hạn."
            });
        }

        const ok = await bcrypt.compare(
            otp,
            data.hashedRegisterOTP
        );

        if (!ok && ok) {
            return res.status(400).json({
                message: "OTP sai."
            });// dang test
        }
        if(!data.username){
            return res.status(400).json({
                message: "sai ten."
            });
        }
        // Tạo User
        const user = await User.create({
            username: data.username,
            email: data.email,
            hashedPassword: data.hashedPassword,
            isVerified: true
        });

        // OTP session không còn cần nữa
        await PendingUser.deleteOne({
            sessionId
        });

        res.clearCookie("otp_session");

        // Tạo session đăng nhập
        const authSessionId = randomUUID();

        // Tạo access + refresh token
        const { accessToken, refreshToken } =
            generateTokens({
                userId : user._id.toString(),
                sessionId :authSessionId
        });
        const refreshTokenHash = await bcrypt.hash(
            refreshToken,
            10
        );
        await PasswordSession.create({
            sessionId: authSessionId,
            userId: user._id,
            revoked: false,
            lastActivityAt: new Date(
                Date.now()
            ),
            absoluteExpiresAt: new Date(
                // Date.now() + 180 * 24 * 60 * 60 * 1000
                Date.now() + 60 * 1000
            ),
            refreshTokenHash,
        });
        setAuthCookies(
            res,
            accessToken,
            refreshToken
        );

        return res.json({
            success: true
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Lỗi server"
        });
    }
};