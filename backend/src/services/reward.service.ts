import { UserLessonProgress,Milestone } from "../types/typeUserLesson.js";
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
} as const ;
const baseRewardAmount = 100; // coin

const lessonCountMultiplier = [
    { count: 10, multiplier: 1 },
    { count: 20, multiplier: 1.4 },
    { count: 30, multiplier: 1.8 },
    { count: 40, multiplier: 2.1 },
    { count: 50, multiplier: 2.3 },
] as const;
const findPassedThreshold = <
        T extends Record<K, number>,
        K extends keyof T
    >(
        arr: readonly T[],
        target: number,
        key: K
    ) =>
    [...arr]
        .sort((a, b) => b[key] - a[key]) // sắp xếp giảm dần
        .find(item => target >= item[key]); // lấy mốc lớn nhất mà target vượt qua

export const calculateRewardAmount = (
    totalLessons : number,
    difficulty: "easy" | "medium" | "hard"
) => {

    // FIX: nếu totalLessons nhỏ hơn mốc nhỏ nhất (10) thì findPassedThreshold
    // trả về undefined -> crash khi đọc .multiplier. Fallback về multiplier thấp nhất.
    const lessonCountScale =
        findPassedThreshold(lessonCountMultiplier, totalLessons, "count")
        ?? lessonCountMultiplier[0];

    // FIX: validate difficulty, tránh NaN âm thầm khi difficulty không hợp lệ
    const difficultyScale = difficultyMultiplier[difficulty];
    if (difficultyScale === undefined) {
        throw new Error(`Invalid difficulty: ${difficulty}`);
    }

    const milestoneRewards = Object.fromEntries( // fromEntries bien array thanh object, entries bien object thanh array
        Object.entries(rewardMilestones).map(([percent, rewardRatio]) => [
            percent,
            baseRewardAmount *
                lessonCountScale.multiplier *
                difficultyScale *
                rewardRatio
        ])
    ) as Record<Milestone, number>;

    return {
        totalRewardCanClaim:
            baseRewardAmount *
            lessonCountScale.multiplier *
            difficultyScale,

        milestoneRewards
    };
};

export const calculateMilestoneReward = (percent : number, lessonProgress: UserLessonProgress) => {
    const highestMilestoneReceived = lessonProgress.highestMilestoneReceived
        ? Number(lessonProgress.highestMilestoneReceived)
        : null;

    // FIX: đọc đúng field "milestoneRewards" (trước đây bị lưu nhầm thành "reward"
    // ở evaluateAttempt.service.js -> startAttempt, nên field này luôn undefined)
    const milestoneRewards = lessonProgress.milestoneRewards ?? {};

    const milestones = Object.keys(milestoneRewards)
        .map(Number)
        .filter((m): m is Milestone => 
            [50, 70, 80, 90, 100].includes(m as Milestone)
        );

    const milestone = milestones
        .sort((a, b) => a - b)
        .filter(m => percent >= m)
        .pop();
    if (milestone === undefined) return null; // no milestone reached yet
    if (milestone === highestMilestoneReceived) return null; // already claimed this milestone

    return { milestone, coin: milestoneRewards[milestone] };
};