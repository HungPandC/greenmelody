import mongoose from "mongoose";
import { DailyChallengeModel } from "../types/typeDailyChallenge.js";
const dailyChallengeSchema = new mongoose.Schema<DailyChallengeModel>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    targets: {
        practiceTime: Number, // phút
        exercises: Number,
        stars: Number
    },
    progress: {
        practiceTime: Number,
        exercises: Number,
        stars: Number
    },
    rewards: {
        practiceTime: {
            canScale: Boolean,
            checkpoint30: { rewardType: String, amount: Number },
            checkpoint70: { rewardType: String, amount: Number },
            completion: { rewardType: String, amount: Number }
        },
        exercises: {
            canScale: Boolean,
            checkpoint30: { rewardType: String, amount: Number },
            checkpoint70: { rewardType: String, amount: Number },
            completion: { rewardType: String, amount: Number }
        },
        stars: {
            canScale: Boolean,
            checkpoint30: { rewardType: String, amount: Number },
            checkpoint70: { rewardType: String, amount: Number },
            completion: { rewardType: String, amount: Number }
        }
    },

    claimed: {
        practiceTime: {
            checkpoint30: Boolean,
            checkpoint70: Boolean,
            completion: Boolean
        },
        exercises: {
            checkpoint30: Boolean,
            checkpoint70: Boolean,
            completion: Boolean
        },
        stars: {
            checkpoint30: Boolean,
            checkpoint70: Boolean,
            completion: Boolean
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});
dailyChallengeSchema.index(
    { userId: 1, date: 1 },
    { unique: true }
);

export default mongoose.model(
    "DailyChallenge",
    dailyChallengeSchema
);