import { RequestHandler } from "express";

import {
    startAttempt,
    submitAnswer,
} from "../services/evaluateAttempt.service.js";

import { isSkill } from "../controllers/getSkill.controller.js";


export const startAttemptController: RequestHandler<{
    skill: string;
    lessonId: string;
}> = async (req, res) => {

    try {
        const userId = req.user.userId;

        const { skill, lessonId } = req.params;

        if (!isSkill(skill)) {
            return res.status(400).json({
                message: "Invalid skill parameter",
            });
        }

        const result = await startAttempt(
            userId,
            skill,
            lessonId
        );

        return res.status(201).json(result);

    } catch (error: unknown) {

        if (error instanceof Error) {
            return res.status(500).json({
                message: error.message,
            });
        }

        return res.status(500).json({
            message: "Unknown error",
        });
    }
};


export const submitAnswerController: RequestHandler<{
    attemptId: string;
    questionIndex: string;
}> = async (req, res) => {

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

        return res.status(200).json(result);

    } catch (error: unknown) {

        if (error instanceof Error) {
            return res.status(500).json({
                message: error.message,
            });
        }

        return res.status(500).json({
            message: "Unknown error",
        });
    }
};
