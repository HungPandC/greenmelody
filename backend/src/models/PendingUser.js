import mongoose from "mongoose";

const pendingUserSchema = new mongoose.Schema({
    sessionId: String,

    username: String,

    email: String,

    hashedPassword: String,

    hashedRegisterOTP: String,

    emailOTPExpires: Date,

    expiredAt: Date
});

export default mongoose.model("PendingUser", pendingUserSchema);