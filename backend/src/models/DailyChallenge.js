import mongoose from "mongoose";

const dailyChallengeShema = mongoose.Schema({
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
        checkpoint30: Boolean,
        checkpoint70: Boolean,
        completion: Boolean
    }
})
dailyChallengeSchema.index(
    { userId: 1, date: 1 },
    { unique: true }
);

export default mongoose.model(
    "DailyChallenge",
    dailyChallengeShema
);