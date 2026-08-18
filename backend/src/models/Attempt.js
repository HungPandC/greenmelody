import mongoose from "mongoose";

const AttemptSchema = new mongoose.Schema(
    {
        attemptId: {
            type: String,
            required: true,
            unique: true,
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        lessonId: {
            type: String,
            required: true,
        },

        questions: [
            {
                questionId: {
                    type: String,
                    required: true,
                },
                options: {
                    type: [String],
                    default: [],
                },
            },
        ],

        answers: [
            {
                questionId: {
                    type: String,
                    required: true,
                },

                answer: {
                    type: mongoose.Schema.Types.Mixed,
                    required: true,
                },
            },
        ],

        completed: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Attempt", AttemptSchema);