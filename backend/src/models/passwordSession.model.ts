import mongoose from "mongoose";

const passwordSchema = new mongoose.Schema({
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

    revoked: {
        type: Boolean,
        default: false
    },


    refreshTokenHash: {
        type: String,
    },

    lastActivityAt: {
        type: Date,
        required: true,
        // ngay bay gio
    },

    absoluteExpiresAt: {
        type: Date,
        required: true,
        // 180 ngay sau
    },
});

export default mongoose.model(
    "PasswordSession",
    passwordSchema
);