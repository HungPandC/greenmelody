import mongoose from "mongoose";

interface PasswordResetSession {
    sessionId: string;
    userId: mongoose.Types.ObjectId;
    hashedResetOtp: string | null;
    isVerified: boolean;
    expiredAt: Date;
}

const passwordResetSchema = new mongoose.Schema<PasswordResetSession>({
    sessionId: {
        type: String,
        required: true,
        unique: true,
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    hashedResetOtp: {
        type: String,
        default: null,
    },

    isVerified: {
        type: Boolean,
        default: false,
    },

    expiredAt: {
        type: Date,
        required: true,
    },
});

export default mongoose.model<PasswordResetSession>(
    "PasswordResetSession",
    passwordResetSchema
);