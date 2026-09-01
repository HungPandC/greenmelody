import mongoose from "mongoose";
interface userLesson {
    userId : mongoose.Types.ObjectId,
    lesson : {
        completion: boolean,
        lastPercent : number,
        highestMilestoneReceived: number
        totalRewardCanClaim : number,
        milestoneRewards: {
            50: number,
            //...
        }
    }
}
const userLessonSchema = new mongoose.Schema<userLesson>(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },

        lesson: {
            type: Map,
            of: new mongoose.Schema(
                {
                    completion: {
                        type: Boolean,
                        default: false,
                    },
                    lastPercent: {
                        type: Number,
                        min: 0,
                        max : 100,
                    },
                    highestMilestoneReceived: {
                        type: Number,
                        enum: [50, 70, 80, 90, 100]
                    },
                    totalRewardCanClaim: {
                        type: Number,
                        min: 0
                    },
                    milestoneRewards: {
                        50: Number,
                        70: Number,
                        80: Number,
                        90: Number,
                        100: Number,
                    }
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

export default mongoose.model("UserLesson", userLessonSchema);