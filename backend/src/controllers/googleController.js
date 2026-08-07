import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";
import { generateTokens,setAuthCookies } from "../libs/auth.js";



const client = new OAuth2Client("93291837825-aq7j7ag5nnvef7mh5t9876r879m9s73a.apps.googleusercontent.com");
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
        
        const user = await User.findOne({ email });

        if (!user) {
            const newUser = await User.create({
                username: name ?? email.split("@")[0],
                email,
                googleId,
            });

            const { accessToken, refreshToken } =
                await generateTokens(newUser._id.toString());
            setAuthCookies(res, accessToken, refreshToken);
        } else {
            if (!user.googleId) {
                user.googleId = googleId;
                await user.save();
            }
            
            const { accessToken, refreshToken } =
                await generateTokens(user._id.toString());
            setAuthCookies(res, accessToken, refreshToken);
        }

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