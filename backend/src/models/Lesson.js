// FILE NAY KO CAN THIET // FILE NAY KO CAN THIET// FILE NAY KO CAN THIET// FILE NAY KO CAN THIET
// FILE NAY KO CAN THIET // FILE NAY KO CAN THIET   // FILE NAY KO CAN THIET   // FILE NAY KO CAN THIET   
// FILE NAY KO CAN THIET// FILE NAY KO CAN THIET   // FILE NAY KO CAN THIET   // FILE NAY KO CAN THIET   
// FILE NAY KO CAN THIET   // FILE NAY KO CAN THIET   // FILE NAY KO CAN THIET   // FILE NAY KO CAN THIET   
// FILE NAY KO CAN THIET
// FILE NAY KO CAN THIET
// FILE NAY KO CAN THIET
// FILE NAY KO CAN THIET
// FILE NAY KO CAN THIET
// FILE NAY KO CAN THIET
// FILE NAY KO CAN THIET
// FILE NAY KO CAN THIET
// FILE NAY KO CAN THIET

import mongoose from "mongoose";

const LessonSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            required: true,
            unique: true,
        },

        title: {
            type: String,
            required: true,
        },

        skill: {
            type: String,
            required: true,
        },

        order: {
            type: Number,
            required: true,
        },
        // tu id tim trong trong question de kiem question Type
    },
    {
        timestamps: true,
    }
);

const Lesson = mongoose.model("Lesson", LessonSchema);

export default Lesson;