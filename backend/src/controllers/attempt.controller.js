import { startAttempt, submitAnswer } from "../services/evaluateAttempt.service.js";
import { closeWindow } from "../services/evaluateAttempt.service.js";



export const startAttemptController = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { skill,lessonId } = req.params;

        const result = await startAttempt(userId,skill,lessonId);

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
        const { attemptId, questionIndex } = req.params;
        const { answer } = req.body;

        const result = await submitAnswer(
            userId,
            attemptId,
            Number(questionIndex),
            answer
        );

        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};