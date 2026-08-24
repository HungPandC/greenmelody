import mongoose from "mongoose";

const userLessonSchema = new mongoose.Schema(
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
                    MocLonNhatDaNhan:{
                        type : Number,
                        enum: [50,70,80,90,100]
                    },
                    totalRewardCanClaim:{
                        type: Number,
                        min: 0
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