import Lesson from "../models/Lesson"
import { lessons } from "../data/lessons"
import UserLesson from "../models/UserLesson";



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
    // tao start
    userLesson.startAt = new Date();
    userLesson.save();

    // -> sao nay se gui them cai thong tin ve bai
};

export const submitAnswer = async (userId, attemptId, questionId, answer) => {

};

export const finishAttempt = async (userId, attemptId) => {

};