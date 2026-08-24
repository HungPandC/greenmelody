import User from "../models/user.model";
import DailyChallenge from "../models/dailyChallenge.model";
import { claimReachedDailyRewards,createDailyChallenge,rewardDailyChallenge } from "../services/reward.service";

export const setNewDailyChallenge = async (req, res) => {
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
export const updateDailyChallenge = async (req, res) => {
    const userId = req.user.userId;
    const progress = req.body.progress;

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const challenge = await updateChallengeProgress(
            userId,
            progress,
            session
        );

        const rewards = await rewardDailyChallenge(
            challenge,
            userId,
            progress,
            session
        );

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