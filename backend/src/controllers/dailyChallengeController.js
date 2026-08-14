import User from "../models/User";
import DailyChallenge from "../models/DailyChallenge";
const ALLOWED_PRACTICE_TIMES = [5, 10, 15, 20, 30, 45, 60];
const ALLOWED_EXERCISES = [3, 5, 10, 15, 25, 40, 60];
const ALLOWED_STARS = [1, 2, 3, 5, 8, 12, 15];

export const setNewDailyChallenge = async (req,res)=>{
    const { practiceTime, exercises, stars } = req.body.targets;
    const tomorrow = new Date();

    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    await DailyChallenge.create({
        userId : req.user.userId,
        date: tomorrow,
        targets:{
            practiceTime,
            exercises,
            stars
        },
        progress: {
            practiceTime: 0,
            exercises: 0,
            stars: 0
        },
        rewards: {
            practiceTime: {
                checkpoint30: false,
                checkpoint70: false,
                completion: false
            },

            exercises: {
                checkpoint30: false,
                checkpoint70: false,
                completion: false
            },

            stars: {
                checkpoint30: false,
                checkpoint70: false,
                completion: false
            }
        },
    });
}       
export const updateDailyChallenge = async (req, res) => {
    const challenge = await updateChallengeProgress(
        req.user.userId,
        req.body.progress
    );

    res.json({ challenge });
};