import User from "../models/User";
import DailyChallenge from "../models/DailyChallenge";
import { updateChallengeProgress,createDailyChallenge,rewardDailyChallenge } from "../services/rewardService";



const ALLOWED_PRACTICE_TIMES = [5, 10, 15, 20, 30, 45, 60];
const ALLOWED_EXERCISES = [3, 5, 10, 15, 25, 40, 60];
const ALLOWED_STARS = [1, 2, 3, 5, 8, 12, 15];


export const setNewDailyChallenge = async (req, res) => {
    const challenge = await createDailyChallenge(
        req.user.userId,
        req.body.targets
    );
    res.status(201).json({
        message: "Daily challenge created",
        challenge
    });
};
export const updateDailyChallenge = async (req, res) => {
    const userId = req.user.userId;
    const progress = req.body.progress;
    const challenge = await updateChallengeProgress(
        userId,
        progress,
    );
    const reward = await rewardDailyChallenge(
        challenge,
        userId,
        progress
    )
    res.json({ challenge });
};