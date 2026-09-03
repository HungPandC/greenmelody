import mongoose from "mongoose";
import { UserLessonModel } from "../types/typeUserLesson.js";
import { UserLessonProgress } from "../types/typeUserLesson.js";

const userLessonSchema = new mongoose.Schema<UserLessonModel>(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },

        lesson: {
            type: Map,
            of: new mongoose.Schema<UserLessonProgress>(
                {
                    completion: {
                        type: Boolean,
                        default: false,
                    },
                    lastPercent: {
                        type: Number,
                        min: 0,
                        max: 100,
                    },
                    highestMilestoneReceived: {
                        type: Number,
                        enum: [50, 70, 80, 90, 100],
                    },
                    totalRewardCanClaim: {
                        type: Number,
                        min: 0,
                    },
                    milestoneRewards: {
                        50: Number,
                        70: Number,
                        80: Number,
                        90: Number,
                        100: Number,
                    },
                },
                { _id: false }
            ),
            default: {},
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<UserLessonModel>("UserLesson", userLessonSchema);