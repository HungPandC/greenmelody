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
    revoked: {
        type: Boolean,
        default: false
    }
});

export default mongoose.model("PasswordSession", passwordSchema);