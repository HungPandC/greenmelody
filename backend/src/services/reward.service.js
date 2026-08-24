import { pitch } from "../data/Eartraining/pitch";
import UserLesson from "../models/userLesson.model.js";
// chx scale he so
const multiplierTotalAttempt  = {
    easy : 1, // he so nhan
    medium : 1.5,
    hard: 2
}
const multiplierDifficulty  = {
    easy : 1, // he so nhan
    medium : 1.5,
    hard: 2
}
const cacMocNhanQua = {
    "50" : 0.35,
    "70" : 0.55,
    "80" : 0.70,
    "90" : 0.85,
    "100" : 1
}
const rewardScale = [
    { count: 5, multiplier: 1 },
    { count: 10, multiplier: 1.4 },
    { count: 20, multiplier: 1.8 },
    { count: 30, multiplier: 2.1 },
    { count: 40, multiplier: 2.3 },
    { count: 50, multiplier: 2.5 },
];
export const calculateRewarDailyChallengeAmount = (req,res)=>{

}