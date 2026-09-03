import mongoose from "mongoose";

interface AttemptQuestion {
    questionIndex: number;
    options: string[];
}

interface AttemptAnswer {
    questionIndex: number;
    answer: any;
}

export interface AttemptModel {
    attemptId: string;
    userId: mongoose.Types.ObjectId;
    lessonId: string;

    // type: "pitch-direction" | "pitch-compare" | "pitch-highestLowest" | "pitch-findDuplicate";
    // difficultyOctave?: "easy" | "medium" | "hardHight" | "hardLow" | "extreme";
    // difficultyDistance?: "easy" | "medium" | "hard";

    questions: AttemptQuestion[];
    answers: AttemptAnswer[];
    questionCount: number;

    startAt: Date;
    endAt?: Date;
    lastMeaningfulActivityAt?: Date;
    lastHeartbeatAt?: Date;
    activeTime: number; // milliseconds

    currentTimeWindow?: "question" | "review";
    currentWindowStartedAt?: Date;

    status: "in-progress" | "completed" | "abandoned" | "expired" | "failed";
    totalRight: number;

    currentQuestionIndex: number;
}

const AttemptSchema = new mongoose.Schema<AttemptModel>(
    {
        // Identifiers
        attemptId: { type: String, required: true, unique: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        lessonId: { type: String, required: true },

        // Loại bài & độ khó
        // type: {
        //     type: String,
        //     required: true,
        //     enum: [
        //         "pitch-direction",
        //         "pitch-compare",
        //         "pitch-highestLowest",
        //         "pitch-findDuplicate",
        //     ],
        // },
        // difficultyOctave: {
        //     type: String,
        //     enum: ["easy", "medium", "hardHight", "hardLow", "extreme"],
        // },
        // difficultyDistance: {
        //     type: String,
        //     enum: ["easy", "medium", "hard"],
        // },

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
                validator: function (this: any, value: number) {
                    return value <= (this.questionCount ?? Infinity);
                },
                message: "totalRight không được lớn hơn questionCount",
            },
        },
        currentQuestionIndex: {
            type: Number,
            default: 1
        },
    },
    { timestamps: true }
);

export default mongoose.model<AttemptModel>("Attempt", AttemptSchema);