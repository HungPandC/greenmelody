import User from "../models/User";
import DailyChallenge from "../models/DailyChallenge";
import { updateChallengeProgress } from "../services/rewardService";




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
const rewardDailyChallenge = async (req,res) => {
    
}
export const updateDailyChallenge = async (req, res) => {
    const challenge = await updateChallengeProgress(
        req.user.userId,
        req.body.progress
    );

    res.json({ challenge });
};