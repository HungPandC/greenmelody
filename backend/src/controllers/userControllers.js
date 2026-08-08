import { randomInt } from "node:crypto";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import transporter from "../libs/mail.js";
import PendingUser from "../models/PendingUser.js";
import { randomUUID } from "node:crypto";
import PasswordReset from "../models/PasswordSession.js";
import PasswordSession from "../models/PasswordSession.js";


export const ChangePassword = async (req, res) => {
    try {
        const { oldPass, newPass, confirmPass } = req.body;

        // Kiểm tra dữ liệu
        if (!oldPass || !newPass || !confirmPass) {
            return res.status(400).json({
                message: "Không được thiếu thông tin",
            });
        }


        // Tìm user
        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({
                message: "Không tìm thấy người dùng",
            });
        }

        // Kiểm tra mật khẩu cũ
        const isMatch = await bcrypt.compare(
            oldPass,
            user.hashedPassword
        );

        if (!isMatch) {
            return res.status(400).json({
                message: "Mật khẩu cũ không đúng",
            });
        }

        // Kiểm tra xác nhận mật khẩu
        if (newPass !== confirmPass) {
            return res.status(400).json({
                message: "Mật khẩu xác nhận không khớp",
            });
        }

        // Không cho trùng mật khẩu cũ
        if (oldPass === newPass) {
            return res.status(400).json({
                message: "Mật khẩu mới không được trùng mật khẩu cũ",
            });
        }

        // Hash mật khẩu mới
        user.hashedPassword = await bcrypt.hash(newPass, 10);

        // Lưu
        await user.save();

        return res.status(200).json({
            message: "Đổi mật khẩu thành công",
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            message: "Lỗi máy chủ",
        });
    }
};
export const forgotPasswordController = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email không được để trống."
            });
        }

        const user = await User.findOne({ email });

        // Không tiết lộ email có tồn tại hay không
        if (!user) {
            return res.status(200).json({
                success: true,
                message: "Nếu email tồn tại, hướng dẫn đặt lại mật khẩu sẽ được gửi đến email của bạn."
            });
        }

        // Xóa các session cũ của người dùng
        await PasswordSession.deleteMany({
            userId: user._id
        });

        const sessionId = randomUUID();

        const newSession = new PasswordSession({
            sessionId,
            userId: user._id,
            expiredAt: new Date(Date.now() + 5 * 60 * 1000)
        });

        await newSession.save();

        res.cookie("otp_session_forgot", sessionId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 5 * 60 * 1000
        });

        return res.status(200).json({
            success: true,
            message: "Nếu email tồn tại, hướng dẫn đặt lại mật khẩu sẽ được gửi đến email của bạn."
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Đã xảy ra lỗi máy chủ."
        });
    }
};


export const sendResetOtpController = async (req, res) => {
    try {
        const sessionId = req.cookies.otp_session_forgot;

        if (!sessionId) {
            return res.status(401).json({
                success: false,
                message: "Phiên đặt lại mật khẩu không tồn tại."
            });
        }

        const session = await PasswordSession.findOne({ sessionId });

        if (!session) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy phiên đặt lại mật khẩu."
            });
        }

        if (session.expiredAt < new Date()) {
            return res.status(410).json({
                success: false,
                message: "Phiên đặt lại mật khẩu đã hết hạn."
            });
        }

        const user = await User.findById(session.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy người dùng."
            });
        }

        const otp = randomInt(100000, 1000000).toString();  

        const hashedResetOtp = await bcrypt.hash(otp, 10);

        session.hashedResetOtp = hashedResetOtp;
        session.isVerified = false;

        await session.save();

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Mã xác thực đặt lại mật khẩu",
            text: `Mã OTP của bạn là: ${otp}\n\nMã có hiệu lực trong 5 phút.`
        });

        return res.status(200).json({
            success: true,
            message: "Đã gửi mã OTP đến email."
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Đã xảy ra lỗi máy chủ."
        });
    }
};
export const verifyResetOtpController = async (req, res) => {
    try {
        const { otp } = req.body;
        const sessionId = req.cookies.otp_session_forgot;

        if (!sessionId) {
            return res.status(401).json({
                success: false,
                message: "Phiên đặt lại mật khẩu không tồn tại."
            });
        }

        if (!otp) {
            return res.status(400).json({
                success: false,
                message: "Mã OTP không được để trống."
            });
        }

        const session = await PasswordSession.findOne({ sessionId });

        if (!session) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy phiên đặt lại mật khẩu."
            });
        }

        if (session.expiredAt < new Date()) {
            return res.status(410).json({
                success: false,
                message: "Phiên đặt lại mật khẩu đã hết hạn."
            });
        }

        if (!session.hashedResetOtp) {
            return res.status(400).json({
                success: false,
                message: "Chưa gửi mã OTP."
            });
        }

        const isMatch = await bcrypt.compare(
            otp,
            session.hashedResetOtp
        );

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Mã OTP không chính xác."
            });
        }

        session.isVerified = true;
        await session.save();

        return res.status(200).json({
            success: true,
            message: "Xác thực OTP thành công."
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Đã xảy ra lỗi máy chủ."
        });
    }
};
export const resetPasswordController = async (req, res) => {
    try {
        const { newPassword, newPasswordAgain } = req.body;
        const sessionId = req.cookies.otp_session_forgot;

        if (!sessionId) {
            return res.status(401).json({
                success: false,
                message: "Phiên đặt lại mật khẩu không tồn tại."
            });
        }

        if (!newPassword || !newPasswordAgain) {
            return res.status(400).json({
                success: false,
                message: "Mật khẩu không được để trống."
            });
        }

        if (newPassword !== newPasswordAgain) {
            return res.status(400).json({
                success: false,
                message: "Hai mật khẩu không khớp."
            });
        }

        const session = await PasswordSession.findOne({ sessionId });

        if (!session) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy phiên đặt lại mật khẩu."
            });
        }

        if (session.expiredAt < new Date()) {
            return res.status(410).json({
                success: false,
                message: "Phiên đặt lại mật khẩu đã hết hạn."
            });
        }

        if (!session.isVerified) {
            return res.status(403).json({
                success: false,
                message: "Bạn chưa xác thực OTP."
            });
        }

        const user = await User.findById(session.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy người dùng."
            });
        }

        const isSamePassword = await bcrypt.compare(
            newPassword,
            user.hashedPassword
        );

        if (isSamePassword) {
            return res.status(400).json({
                success: false,
                message: "Mật khẩu mới không được trùng với mật khẩu cũ."
            });
        }

        user.hashedPassword = await bcrypt.hash(newPassword, 10);
        await user.save();

        // Xóa toàn bộ session quên mật khẩu của người dùng
        await PasswordSession.deleteMany({
            userId: user._id
        });

        res.clearCookie("otp_session_forgot");

        return res.status(200).json({
            success: true,
            message: "Đặt lại mật khẩu thành công."
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Đã xảy ra lỗi máy chủ."
        });
    }
};