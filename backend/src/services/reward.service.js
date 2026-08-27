import { addCoin } from "./economy.service";

const difficultyMultiplier = {
    easy: 1,
    medium: 1.5,
    hard: 2
};

const rewardMilestones = {
    "50": 0.35,
    "70": 0.55,
    "80": 0.70,
    "90": 0.85,
    "100": 1
};

const baseRewardAmount = 100; // coin

const lessonCountMultiplier = [
    { count: 10, multiplier: 1 },
    { count: 20, multiplier: 1.4 },
    { count: 30, multiplier: 1.8 },
    { count: 40, multiplier: 2.1 },
    { count: 50, multiplier: 2.3 },
];

const findPassedThreshold = (arr, target, key) =>
    [...arr]
        .sort((a, b) => b[key] - a[key]) // sắp xếp giảm dần
        .find(item => target >= item[key]); // lấy mốc lớn nhất mà target vượt qua

export const calculateRewardAmount = (
    totalLessons,
    difficulty
) => {

    const lessonCountScale = findPassedThreshold(
        lessonCountMultiplier,
        totalLessons,
        "count"
    );

    const difficultyScale = difficultyMultiplier[difficulty];

    const milestoneRewards = Object.entries(rewardMilestones).reduce(
        (acc, [percent, rewardRatio]) => {
            acc[percent] = 
                baseRewardAmount *
                lessonCountScale.multiplier *
                difficultyScale *
                rewardRatio;
            return acc;
        },
        {}
    );

    return {
        totalRewardCanClaim:
            baseRewardAmount *
            lessonCountScale.multiplier *
            difficultyScale,

        milestoneRewards
    };
};

export const calculateMilestoneReward = (percent, userLesson) => {
    const highestMilestoneReceived = userLesson.highestMilestoneReceived
        ? Number(userLesson.highestMilestoneReceived)
        : null;

    const milestone = Object.keys(userLesson.milestoneRewards)
        .map(Number)
        .sort((a, b) => a - b)
        .filter(m => percent >= m)
        .pop(); // get the highest milestone reached

    if (milestone === undefined) return null; // no milestone reached yet
    if (milestone === highestMilestoneReceived) return null; // already claimed this milestone

    return { milestone, coin: userLesson.milestoneRewards[milestone] };
};