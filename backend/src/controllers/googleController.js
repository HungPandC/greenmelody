import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";
import { generateTokens,setAuthCookies } from "../libs/auth.js";
import PasswordSession from "../models/PasswordSession.js";
import { randomUUID } from "node:crypto";
import bcrypt from "bcrypt";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const loginGoogleController = async (req , res) => {
    try{
        const { idToken } = req.body;
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID_NEW,
        });
        if(!ticket){
            return res.status(400).json({message: "loi token"})
        }
        const payload = ticket.getPayload();
        if (!payload || !payload.email) {
            return res.status(401).json({
                success: false,
                message: "Google token không hợp lệ",
            });
        }
        if (!payload.email_verified) {
            return res.status(401).json({
                success: false,
                message: "Email chưa được Google xác minh",
            });
        }
        const email = payload.email;
        const name = payload.name;
        const googleId = payload.sub;
        
        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                username: name ?? email.split("@")[0],
                email,
                googleId,
                isVerified: true
            });
        } else {
            if (!user.googleId) {
                user.googleId = googleId;
                await user.save();
            }
        }

        const sessionId = randomUUID();

        const { accessToken, refreshToken } =
            generateTokens(
                user._id.toString(),
                sessionId
            );
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

        return res.json({
            success: true,
        });
    }catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: "Đăng nhập Google thất bại",
        });
    }
}