import {
    startAttempt,
    submitAnswer,
    finishAttempt,
} from "./attempt.service.js";

export const startAttemptController = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { lessonId } = req.params;

        const result = await startAttempt(userId, lessonId);

        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};
export const submitAnswerController = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { attemptId, questionId, answer } = req.body;

        const result = await submitAnswer(
            userId,
            attemptId,
            questionId,
            answer
        );

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

export const finishAttemptController = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { attemptId } = req.body;

        const result = await finishAttempt(userId, attemptId);

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};