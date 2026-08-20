import UserLesson from "../models/userLesson.model";
import {pitchLesson} from "../data/pitch";
import Attempt from "../models/attempt.model.js";
import crypto from "crypto";
import { createPitchAttempt } from "./createAttempt.service.js";
import { array } from "yargs";



const endFailed = ()=>{

}
export const startAttempt = async (userId, lessonId) => {
    const userLesson = await UserLesson.findOne({ userId });
    // tao va luu vao UserLesson
    if (!userLesson) {
        await UserLesson.create({
            userId,
            lesson: {
                [lessonId]: {
                    completion: false,
                },
            },
        });
    } else {
        if (!userLesson.lesson.has(lessonId)) {
            userLesson.lesson.set(lessonId, {
                completion: false,
            });

            await userLesson.save();
        }
    }
    const lesson = pitchLesson.find(
        lesson => lesson.id === lessonId
    );
    if (!lesson) {
        throw new Error("Lesson not found");
    }
    const attemptId = crypto.randomUUID();

    let questions = [];
    let answers = [];

    for (let index = 0; index < lesson.questionCount; index++) {
        const { question, answer } = createPitchAttempt(lesson);

        questions.push({
            questionIndex: index + 1,
            options: question
        });

        answers.push({
            answerIndex: index + 1,
            answer
        });
    }
    const attempt = await Attempt.create({
        attemptId,
        userId,
        difficultyOctave: lesson.BaseDifficultyOctave,
        difficultyDistance: lesson.BaseDifficultyDistance,
        lessonId: lesson.id,
        type: lesson.type,
        questions,
        answers
    });

    // -> sao nay se gui them cai thong tin ve bai
};

export const submitAnswer = async (userId, attemptId, questionId, answer) => {

};

export const finishAttempt = async (userId, attemptId) => {

};