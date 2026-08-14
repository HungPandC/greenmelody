import mongoose from "mongoose";
import { boolean } from "yargs";

const dailyChallengeSchema = mongoose.Schema({
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
            checkpoint30: { type: String, amount: Number },
            checkpoint70: { type: String, amount: Number },
            completion: { type: String, amount: Number }
        },
        exercises: {
            canScale: Boolean,
            checkpoint30: { type: String, amount: Number },
            checkpoint70: { type: String, amount: Number },
            completion: { type: String, amount: Number }
        },
        stars: {
            canScale: Boolean,
            checkpoint30: { type: String, amount: Number },
            checkpoint70: { type: String, amount: Number },
            completion: { type: String, amount: Number }
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