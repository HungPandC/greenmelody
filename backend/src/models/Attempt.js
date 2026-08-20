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
        difficultyOctave: {
            type: String,
            enum: ["easy", "medium", "hardHight", "hardLow", "extreme"],
        },

        difficultyDistance: {
            type: String,
            enum: ["easy", "medium", "hard"],
        },
        lessonId: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true,
            enum: [
                "pitch-direction",
                "pitch-compare",
                "pitch-highestLowest",
                "pitch-findDuplicate",
            ],
        },
        questions: [
            {
                questionIndex: {
                    type: Number,
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
                answerIndex: {
                    type: Number,
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