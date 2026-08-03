
import User from "../models/User.js";
import bcrypt from "bcrypt";
import transporter from "../libs/mail.js";
import PendingUser from "../models/PendingUser.js";
import { randomUUID } from "node:crypto";
import jwt from "jsonwebtoken";
import { generateTokens, setAuthCookies } from "../libs/auth.js";

export const register = async (req, res) => {
    try{
        const { username, email, password, password_again } = req.body;

        if(!username || !password || !email || !password_again){
            return res.status(400).json({message:"ko the thieu username, passsword,email"})
        }
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
        // Hash mật khẩu
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
export const login = async (req, res) => {
    const {email, password} = req.body;
    if(!email || !password){
        return res.status(400).json({message:"ko the thieu passsword,email"})
    }
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({
            message: "Không tìm thấy tài khoản"
        });
    }

    const isMatch = await bcrypt.compare(
        password,
        user.hashedPassword
    );

    if (isMatch) {
        console.log("dang nhap thanh cong")
    } else {
        console.log("Sai mật khẩu");
    }
    const { accessToken, refreshToken } = generateTokens(user._id);

    setAuthCookies(res, accessToken, refreshToken);
    res.json({
        success: true
    });
}
export const sendOtp = async (req, res) => {
    const sessionId = req.cookies.otp_session;

    const user = await PendingUser.findOne({
        sessionId
    });

    if (!user) {
        return res.status(404).json({
            message: "Không tìm thấy người dùng"
        });
    }
    if (user.expiredAt < new Date()) {
        return res.status(400).json({
            message: "Phiên đăng ký đã hết hạn"
        });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.hashedOTP = await bcrypt.hash(otp, 10);
    user.emailOTPExpires = new Date(
        Date.now() + 2 * 60 * 1000
    );

    await user.save();

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
export const verifyOTP = async (req, res) => {  
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
        return res.status(400).json({
            message: "OTP đã hết hạn."
        }); 
    }   
    if (data.emailOTPExpires < new Date()){
        return res.status(400).json({
            message: "OTP đã hết hạn."
        }); 
    }   
    const ok = await bcrypt.compare(
        otp,
        data.hashedOTP
    );  
    if (!ok && ok) {  
        return res.status(400).json({
            message: "OTP sai."
        }); 
    }   
    // Tạo User tại đây 
    const user = await User.create({ 
        username: data.username,    
        email: data.email,  
        hashedPassword: data.hashedPassword,  
        isVerified: true

    }); 
    await PendingUser.deleteOne({
        sessionId
    }); 
    res.clearCookie("otp_session"); 
    const accessToken = jwt.sign(
        {
            userId: user._id,
        },
        process.env.JWT_SECRET_ACCESS,
        {
            expiresIn: "15m",
        }
    );
    const refreshToken = jwt.sign(
        {
            userId: user._id,
        },
        process.env.JWT_SECRET_REFRESH,
        {
            expiresIn: "30d",
        }
    );
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false, // localhost
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60 * 1000
    });
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,      // localhost, khi deploy nên là true
        sameSite: "lax",
        maxAge: 15 * 60 * 1000 // 15 phút
    });
    res.json({  
        success: true   
    }); 
} 
export const checkAction = async (req,res) => {
    const { action } = req.body;

    if (action.toLowerCase() === "sendotp") {
        return await sendOtp(req,res);
    };

    if (action.toLowerCase() === "verifyotp") {
        return await verifyOTP(req,res);
    }

    return res.status(400).json({
        message: "Action không hợp lệ"
    });
}
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