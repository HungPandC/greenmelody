import User from "../models/user.model.js";
import DailyChallenge from "../models/dailyChallenge.model.js";
import mongoose from "mongoose";
import { claimReachedDailyRewards,createDailyChallenge,rewardDailyChallenge } from "../services/dailyChallenge.service.js";
import { RequestHandler } from "express";


export const setNewDailyChallenge:RequestHandler = async (req, res) => {
    try {
        const challenge = await createDailyChallenge(
            req.user.userId,
            req.body.targets
        );

        res.status(201).json({
            message: "Daily challenge created",
            challenge
        });

    } catch (error) {
        res.status(400).json({
            message: "Daily challenge couldn't be created"
        });
    }
};
export const updateDailyChallenge:RequestHandler = async (req, res) => {
    const userId = req.user.userId;
    const progress = req.body.progress;
    const key = req.body.key;
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const challenge = await claimReachedDailyRewards({
            userId,
            progress,
            session
        },key);

        const rewards = await rewardDailyChallenge({
            challenge,
            userId,
            progress,
            session
        });

        await challenge.save({ session });

        await session.commitTransaction();

        res.json({
            challenge,
            rewards
        });

    } catch (error) {
        await session.abortTransaction();
        throw error;

    } finally {
        await session.endSession();
    }
};