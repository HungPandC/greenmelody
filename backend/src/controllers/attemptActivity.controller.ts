import Attempt from "../models/attempt.model.js";
import { closeWindow } from "../services/evaluateAttempt.service.js";
import { RequestHandler } from "express";

export const recordAttemptActivity:RequestHandler = async (req, res) => {
    try {
        const { attemptId,type } = req.params;

        const attempt = await Attempt.findOne({ attemptId });

        if (!attempt) {
            return res.status(404).json({
                message: "Attempt not found"
            });
        }

        if (attempt.status !== "in-progress") {
            return res.status(400).json({
                message: "Attempt is not active"
            });
        }

        const now = new Date();


        // =========================
        // LISTEN
        // review → review
        // =========================
        if (type === "listen") {

            if (attempt.currentTimeWindow !== "review") {
                return res.status(400).json({
                    message: "Not in review window"
                });
            }

            // Chỉ ghi nhận user có hoạt động
            attempt.lastMeaningfulActivityAt = now;

            await attempt.save();
        }


        // =========================
        // NEXT
        // review → question
        // =========================
        else if (type === "next") {

            if (attempt.currentTimeWindow !== "review") {
                return res.status(400).json({
                    message: "Not in review window"
                });
            }

            await closeWindow(attempt, now);

            if (attempt.status !== "in-progress") {
                return res.status(400).json({
                    message: "Attempt expired"
                });
            }

            attempt.currentTimeWindow = "question";
            attempt.currentWindowStartedAt = now;
            attempt.lastMeaningfulActivityAt = now;

            await attempt.save();
        }


        else {
            return res.status(400).json({
                message: "Invalid activity type"
            });
        }


        return res.status(200).json({
            message: "Activity recorded"
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Server error"
        });
    }
};
// Cập nhật heartbeat
export const updateHeartbeat:RequestHandler = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { attemptId } = req.params;

        const now = new Date();

        const attempt = await Attempt.findOne({
            attemptId,
            userId,
        });

        if (!attempt) {
            return res.status(404).json({
                message: "Attempt not found",
            });
        }

        if (attempt.status !== "in-progress") {
            return res.status(400).json({
                message: "Attempt is not active",
            });
        }

        attempt.lastHeartbeatAt = now;
        await attempt.save();

        return res.status(200).json({
            message: "Heartbeat updated",
        });

    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};