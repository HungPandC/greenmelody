import mongoose from "mongoose";
// day la file bai goc
const QuestionSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            required: true,
            unique: true,
        },

        lessonId: {
            type: String,
            required: true,
        },

        questionType: {
            type: String,
            required: true,
        },

        options: {
            type: [String],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

const Question = mongoose.model("Question", QuestionSchema);

export default Question;