import mongoose from "mongoose";

const pendingUserSchema = new mongoose.Schema({
    sessionId: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    hashedPassword: {
        type: String,
        required: true
    },
    hashedRegisterOTP: {
        type: String,
    },
    emailOTPExpires: {
        type: Date,
    },
    expiredAt: {
        type: Date,
        required: true
    }
});

export default mongoose.model("PendingUser", pendingUserSchema);