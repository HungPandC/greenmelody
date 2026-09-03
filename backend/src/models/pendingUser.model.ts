import mongoose from "mongoose";

interface PendingUser {
    sessionId: string;
    username: string;
    email: string;
    hashedPassword: string;
    hashedRegisterOTP?: string;
    emailOTPExpires?: Date;
    expiredAt: Date;
}

const pendingUserSchema = new mongoose.Schema<PendingUser>({
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

export default mongoose.model<PendingUser>("PendingUser", pendingUserSchema);