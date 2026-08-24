import UserLesson from "../models/userLesson.model.js";
import {pitch} from "../data/Eartraining/pitch.js";
import Attempt from "../models/attempt.model.js";
import crypto from "crypto";
import { createPitchAttempt } from "./createAttempt.service.js";
import { array } from "yargs";

export const closeWindow = async (attempt, now) => {
    const HEARTBEAT_TIMEOUT = 30 * 1000;
    if (!attempt.currentWindowStartedAt) {
        throw new Error("Current window has not started");
    }

    if (!attempt.lastHeartbeatAt) {
        throw new Error("No heartbeat found");
    }

    const heartbeatExpired =
        now.getTime() - attempt.lastHeartbeatAt.getTime()
        > HEARTBEAT_TIMEOUT;

    const endTime = heartbeatExpired
        ? attempt.lastHeartbeatAt
        : now;

    const elapsed =
        endTime.getTime() -
        attempt.currentWindowStartedAt.getTime();

    if (elapsed > 0) {
        attempt.activeTime += elapsed;
    }

    if (heartbeatExpired) {
        attempt.status = "abandoned";
        attempt.endAt = endTime;
    }

    return attempt;
};


export const startAttempt = async (userId,skill,lessonId) => {
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
    const lesson = pitch.find(
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
            questionIndex: index + 1,
            answer
        });
    }
    const now = new Date();
    const attempt = await Attempt.create({
        attemptId,
        userId,
        
        difficultyOctave: lesson.BaseDifficultyOctave,
        difficultyDistance: lesson.BaseDifficultyDistance,

        lessonId: lesson.id,
        type: lesson.type,

        questions,
        answers,

        startAt: now,
        lastMeaningfulActivityAt: now,
        lastHeartbeatAt: now,

        activeTime: 0,

        currentTimeWindow: "question",
        currentWindowStartedAt: now,

        questionCount : lesson.questionCount,

        remainingHp: 3,

        status: "in-progress",

    });
    return {
        attemptId: attempt.attemptId,
        questionCount: attempt.questionCount,
        remainingHp: attempt.remainingHp,
        status: attempt.status,
    };
};

export const submitAnswer = async (
    userId,
    attemptId,
    questionIndex,
    answerFromFrontend
) => {
    const attempt = await Attempt.findOne({
        userId,
        attemptId,
    });

    if (!attempt) {
        throw new Error("Attempt not found");
    }

    if (attempt.status !== "in-progress") {
        throw new Error("Attempt is not active");
    }

    if (attempt.currentTimeWindow !== "question") {
        throw new Error("Not in question window");
    }

    const now = new Date();

    // Đóng question window và tính activeTime
    await closeWindow(attempt, now);

    if (attempt.status !== "in-progress") {
        throw new Error("Attempt expired");
    }

    const answerData = attempt.answers.find(
        (a) => a.questionIndex === questionIndex
    );

    if (!answerData) {
        throw new Error("Question index not found");
    }

    const isCorrect =
        answerFromFrontend === answerData.answer;

    // Sai → trừ HP
    if (!isCorrect) {
        attempt.remainingHp -= 1;

        if (attempt.remainingHp <= 0) {
            attempt.remainingHp = 0;
            attempt.status = "failed";
            attempt.completed = true;
            attempt.endAt = now;

            await attempt.save();

            return {
                questionIndex,
                isCorrect,
                remainingHp: attempt.remainingHp,
                status: attempt.status,
            };
        }
    }

    // Nếu chưa phải câu cuối → chuyển sang review
    if (questionIndex < attempt.answers.length) {
        attempt.currentTimeWindow = "review";
        attempt.currentWindowStartedAt = now;
        attempt.lastMeaningfulActivityAt = now;
    }

    // Nếu là câu cuối → hoàn thành attempt
    if (questionIndex >= attempt.answers.length) {
        attempt.status = "completed";
        attempt.completed = true;
        attempt.endAt = now;
    }

    await attempt.save();

    return {
        questionIndex,
        isCorrect,
        remainingHp: attempt.remainingHp,
        status: attempt.status,
        currentTimeWindow: attempt.currentTimeWindow,
    };
};