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
                questionIndex: {
                    type: Number,
                    required: true,
                },

                answer: {
                    type: mongoose.Schema.Types.Mixed,
                    required: true,
                },
            },
        ],
        startAt: {
            type: Date,
            required: true,
        },

        endAt: {
            type: Date,
        },

        lastMeaningfulActivityAt: {
            type: Date,
        },

        lastHeartbeatAt: {
            type: Date,
        },

        activeTime: {
            type: Number,
            default: 0, // milliseconds
        },

        currentTimeWindow: {
            type: String,
            enum: ["question", "review"],
        },

        currentWindowStartedAt: {
            type: Date,
        },
        questionCount: {
            type: Number,
            min: 0,
        },
        remainingHp: {
            type: Number,
            default: 3,
            min: 0,
            max: 3,
        },
        status: {
            type: String,
            enum: ["in-progress", "completed", "abandoned", "expired","failed"],
            default: "in-progress",
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Attempt", AttemptSchema);