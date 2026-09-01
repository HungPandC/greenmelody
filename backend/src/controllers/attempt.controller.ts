import { startAttempt, submitAnswer } from "../services/evaluateAttempt.service.js";
import { closeWindow } from "../services/evaluateAttempt.service.js";
import { RequestHandler } from "express";


export const startAttemptController:RequestHandler = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { skill,lessonId } = req.params;

        const result = await startAttempt(userId,skill,lessonId);

        res.status(201).json(result);
    }catch (error: unknown) {
        if (error instanceof Error) {
            return res.status(500).json({
                message: error.message
            });
        }

        return res.status(500).json({
            message: "Unknown error"
        });
    }
};
export const submitAnswerController:RequestHandler = async (req, res) => {
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
    }catch (error: unknown) {
        if (error instanceof Error) {
            return res.status(500).json({
                message: error.message
            });
        }

        return res.status(500).json({
            message: "Unknown error"
        });
    }
};