import UserLesson from "../models/userLesson.model.js";
import { pitch } from "../data/Eartraining/pitch.js";
import Attempt from "../models/attempt.model.js";
import crypto from "crypto";
import mongoose from "mongoose";
import { createPitchAttempt } from "./createAttempt.service.js";
import { Allskill } from "../data/Allskill.ts";
import { calculateMilestoneReward, calculateRewardAmount } from "./reward.service.js";
import { addCoin } from "./economy.service.js";


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


export const startAttempt = async (userId, skill, lessonId) => {
    const lesson = Allskill[skill].find(
        lesson => lesson.id === lessonId
    );
    if (!lesson) {
        throw new Error("Lesson not found");
    }
    const reward = calculateRewardAmount(lesson.totalCount, lesson.difficulty);
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

        questionCount: lesson.questionCount,

        status: "in-progress",

    });
    return {
        attemptId: attempt.attemptId,
        questionCount: attempt.questionCount,
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
    await attempt.save();

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

    if (isCorrect) {
        attempt.totalRight++;
    }

    // Nếu chưa phải câu cuối → chuyển sang review
    if (questionIndex < attempt.answers.length) {
        attempt.currentTimeWindow = "review";
        attempt.currentWindowStartedAt = now;
        attempt.lastMeaningfulActivityAt = now;
    }

    // reward info trả về cho frontend (null nếu không nhận reward)
    let rewardResult = null;

    // Nếu là câu cuối → hoàn thành attempt
    if (questionIndex >= attempt.answers.length) {
        const userLesson = await UserLesson.findOne({ userId });
        const lessonProgress = userLesson.lesson.get(attempt.lessonId);
        const percent = Math.round((attempt.totalRight / attempt.questionCount) * 100);

        // FIX: calculateMilestoneReward có thể trả về null (chưa đạt mốc nào /
        // đã claim mốc cao nhất rồi) -> phải check trước khi đọc .milestone,
        // nếu không sẽ crash "Cannot read properties of null".
        const success = calculateMilestoneReward(percent, lessonProgress);

        if (success && success.milestone) {
            // FIX: gộp addCoin + lưu userLesson vào cùng 1 transaction.
            // Trước đây 2 thao tác này tách rời nhau -> nếu save userLesson lỗi
            // sau khi coin đã cộng, user sẽ được cộng coin nhưng milestone không
            // được đánh dấu đã claim, dẫn tới claim lại nhiều lần (double reward).
            const session = await mongoose.startSession();
            try {
                session.startTransaction();

                await addCoin({
                    userId,
                    amount: success.coin,
                    reason: "hoan thanh reward",
                    session
                });

                // FIX: field đúng là "lastPercent" (theo schema), bản cũ ghi nhầm
                // thành "lastPrecent" nên field lastPercent không bao giờ được cập nhật.
                lessonProgress.lastPercent = percent;
                lessonProgress.highestMilestoneReceived = success.milestone;
                userLesson.lesson.set(attempt.lessonId, lessonProgress);

                await userLesson.save({ session });

                await session.commitTransaction();
            } catch (error) {
                await session.abortTransaction();
                throw error;
            } finally {
                await session.endSession();
            }

            rewardResult = {
                milestone: success.milestone,
                coin: success.coin
            };
        }

        attempt.status = "completed";
        attempt.completed = true;
        attempt.endAt = now;
    }

    await attempt.save();
    return {
        questionIndex,
        isCorrect,
        status: attempt.status,
        currentTimeWindow: attempt.currentTimeWindow,
        // FIX: trước đây không trả reward về, frontend không biết vừa nhận
        // bao nhiêu coin để hiện popup/animation khi hoàn thành bài.
        reward: rewardResult,
    };
};