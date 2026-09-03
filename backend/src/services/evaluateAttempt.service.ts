import UserLesson from "../models/userLesson.model.js";
import Attempt,{ AttemptModel } from "../models/attempt.model.js";
import crypto from "crypto";
import mongoose from "mongoose";
import { createAttempt } from "./createAttempt.service.js";
import { Allskill } from "../data/Allskill.js";
import { calculateMilestoneReward, calculateRewardAmount } from "./reward.service.js";
import { addCoin } from "./economy.service.js";
import { skillLesson } from '../types/typeLesson.js';

export const closeWindow = async (attempt : AttemptModel, now : Date) => {
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


export const startAttempt = async (userId : mongoose.Types.ObjectId, skill : skillLesson, lessonId: string) => {
    const lesson = Allskill[skill].find(
        lesson => lesson.id === lessonId
    );
    if (!lesson) {
        throw new Error("Lesson not found");
    }
    const reward = calculateRewardAmount(lesson.questionCount, lesson.difficulty);
    const userLesson = await UserLesson.findOne({ userId });
    // tao va luu vao UserLesson
    if (!userLesson) {
        await UserLesson.create({
            userId,
            lesson: {
                [lessonId]: {
                    completion: false,
                    totalRewardCanClaim: reward.totalRewardCanClaim,
                    // FIX: field đúng theo schema là "milestoneRewards", không phải "reward".
                    // Với field "reward" cũ, Mongoose (strict mode) sẽ âm thầm loại bỏ nó khi
                    // save, khiến milestoneRewards luôn undefined -> claim reward bị crash.
                    milestoneRewards: reward.milestoneRewards
                },

            },
        });
    } else {
        if (!userLesson.lesson.has(lessonId)) {
            userLesson.lesson.set(lessonId, {
                completion: false,
                totalRewardCanClaim: reward.totalRewardCanClaim,
                milestoneRewards: reward.milestoneRewards
            });

            await userLesson.save();
        }
    }

    const attemptId = crypto.randomUUID();

    let questions = [];
    let answers = [];

    for (let index = 0; index < lesson.questionCount; index++) {
        const { question, answer } = createAttempt(lesson);

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


        lessonId: lesson.id,

        questions,
        answers,

        startAt: now,
        lastMeaningfulActivityAt: now,
        lastHeartbeatAt: now,

        activeTime: 0,

        currentTimeWindow: "question",
        currentWindowStartedAt: now,

        questionCount: lesson.questionCount,

        status: "in-progress",
        currentQuestionIndex: 1,
    });
    return {
        attemptId: attempt.attemptId,
        questionCount: attempt.questionCount,
        status: attempt.status,
    };
};

export const submitAnswer = async (
    userId: mongoose.Types.ObjectId,
    attemptId: string,
    questionIndex: number,
    answerFromFrontend: string
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

    // Server tự kiểm tra user có đang trả lời đúng câu hiện tại không
    if (questionIndex !== attempt.currentQuestionIndex) {
        throw new Error("Invalid question index");
    }

    const now = new Date();

    // Đóng question window và tính activeTime
    await closeWindow(attempt, now);

    if (attempt.status !== "in-progress") {
        await attempt.save();
        throw new Error("Attempt expired");
    }

    // Không tin questionIndex để tìm answer.
    // Server dùng currentQuestionIndex của chính Attempt.
    const answerData = attempt.answers.find(
        a => a.questionIndex === attempt.currentQuestionIndex
    );

    if (!answerData) {
        throw new Error("Question index not found");
    }

    const isCorrect =
        answerFromFrontend === answerData.answer;

    if (isCorrect) {
        attempt.totalRight++;
    }

    const isLastQuestion =
        attempt.currentQuestionIndex >= attempt.answers.length;

    // Câu hiện tại đã được trả lời → chuyển sang câu tiếp theo
    attempt.currentQuestionIndex++;

    let rewardResult = null;

    // =========================
    // CHƯA PHẢI CÂU CUỐI
    // =========================
    if (!isLastQuestion) {
        attempt.currentTimeWindow = "review";
        attempt.currentWindowStartedAt = now;
        attempt.lastMeaningfulActivityAt = now;

        await attempt.save();

        return {
            questionIndex,
            isCorrect,
            status: attempt.status,
            currentTimeWindow: attempt.currentTimeWindow,
            reward: null,
        };
    }

    // =========================
    // CÂU CUỐI → HOÀN THÀNH
    // =========================

    const userLesson = await UserLesson.findOne({
        userId,
    });

    if (!userLesson) {
        throw new Error("Can't find UserLesson");
    }

    const lessonProgress = userLesson.lesson.get(
        attempt.lessonId
    );

    if (!lessonProgress) {
        throw new Error("Can't get lessonProgress");
    }

    const percent = Math.round(
        (attempt.totalRight / attempt.questionCount!) * 100
    );

    const success = calculateMilestoneReward(
        percent,
        lessonProgress
    );

    // =========================
    // CÓ REWARD
    // =========================

    if (success) {
        const session = await mongoose.startSession();

        try {
            await session.startTransaction();

            // Cộng coin
            await addCoin({
                userId,
                amount: success.coin,
                reason: "hoan thanh reward",
                session,
            });

            // Cập nhật lesson progress
            lessonProgress.lastPercent = percent;
            lessonProgress.highestMilestoneReceived =
                success.milestone;

            userLesson.lesson.set(
                attempt.lessonId,
                lessonProgress
            );

            await userLesson.save({
                session,
            });

            // Hoàn thành attempt cũng nằm trong transaction
            attempt.status = "completed";
            attempt.endAt = now;

            await attempt.save({
                session,
            });

            // Tất cả thành công mới commit
            await session.commitTransaction();

            rewardResult = {
                milestone: success.milestone,
                coin: success.coin,
            };

        } catch (error) {
            // Một trong các thao tác lỗi
            // → rollback toàn bộ transaction
            await session.abortTransaction();

            throw error;

        } finally {
            await session.endSession();
        }

    } else {
        // =========================
        // KHÔNG CÓ REWARD
        // =========================

        attempt.status = "completed";
        attempt.endAt = now;

        await attempt.save();
    }

    return {
        questionIndex,
        isCorrect,
        status: attempt.status,
        currentTimeWindow: attempt.currentTimeWindow,
        reward: rewardResult,
    };
};
