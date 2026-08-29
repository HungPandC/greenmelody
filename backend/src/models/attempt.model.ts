import mongoose from "mongoose";

const AttemptSchema = new mongoose.Schema(
    {
        // Identifiers
        attemptId: { type: String, required: true, unique: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        lessonId: { type: String, required: true },

        // Loại bài & độ khó
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
        difficultyOctave: {
            type: String,
            enum: ["easy", "medium", "hardHight", "hardLow", "extreme"],
        },
        difficultyDistance: {
            type: String,
            enum: ["easy", "medium", "hard"],
        },

        // Nội dung câu hỏi & câu trả lời
        questions: [
            {
                questionIndex: { type: Number, required: true },
                options: { type: [String], default: [] },
            },
        ],
        answers: [
            {
                questionIndex: { type: Number, required: true },
                answer: { type: mongoose.Schema.Types.Mixed, required: true },
            },
        ],
        questionCount: { type: Number, min: 0 },

        // Thời gian làm bài
        startAt: { type: Date, required: true },
        endAt: { type: Date },
        lastMeaningfulActivityAt: { type: Date },
        lastHeartbeatAt: { type: Date },
        activeTime: { type: Number, default: 0 }, // milliseconds

        // Trạng thái phiên làm bài (window hiện tại)
        currentTimeWindow: { type: String, enum: ["question", "review"] },
        currentWindowStartedAt: { type: Date },

        // Trạng thái tổng
        status: {
            type: String,
            enum: ["in-progress", "completed", "abandoned", "expired", "failed"],
            default: "in-progress",
        },
        totalRight: {
            type: Number,
            min: 0,
            default: 0,
            validate: {
                validator: function (value) {
                    return value <= this.questionCount;
                },
                message: "totalRight không được lớn hơn questionCount",
            },
        },
    },
    { timestamps: true }
);

export default mongoose.model("Attempt", AttemptSchema);