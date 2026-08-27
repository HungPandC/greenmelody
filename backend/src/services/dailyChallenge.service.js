
import { error } from "node:console";
import { changeCurrency} from "./economy.service";
import { changeInventory } from "./inventory.service";
import DailyChallenge from "../models/dailyChallenge.model";

const rewardScaleStart = {
    practiceTime: 30,
    exercises: 25,
    stars: 8
};
const rewardTiers = {
    tier1: 1,
    tier2: 1.5,
    tier3: 2
};

const checkpointRewards = {
    checkpoint30: 0.2,
    checkpoint70: 0.4,
    completion: 1
};
const practiceTimeTiers = {
    5: 1,
    10: 1,
    15: 1,

    20: 2,
    30: 2,
    45: 2,

    60: 3
};

const exerciseTiers = {
    3: 1,
    5: 1,
    10: 1,

    15: 2,
    25: 2,
    40: 2,

    60: 3
};

const starTiers = {
    1: 1,
    2: 1,
    3: 1,

    5: 2,
    8: 2,
    12: 2,

    15: 3
};
const commonRewards = {
    gem: {
        rewardType: "gem",
        weight: 30,
        baseAmount: 3,
    },
    coin: {
        rewardType: "coin",
        weight: 30,
        baseAmount: 20,
    },
    wateringCan: {
        rewardType: "wateringCan",
        weight: 30,
        baseAmount: 1,
    },
};
const ALLOWED_PRACTICE_TIMES = [5, 10, 15, 20, 30, 45, 60];
const ALLOWED_EXERCISES = [3, 5, 10, 15, 25, 40, 60];
const ALLOWED_STARS = [1, 2, 3, 5, 8, 12, 15];

const getRewardScale = (practiceTimeTarget, exercisesTarget, starsTarget) => {
    // Challenge khó đến mức nào?
    const canScalePracticeTime =
        practiceTimeTarget >= rewardScaleStart.practiceTime;

    const canScaleExercises =
        exercisesTarget >= rewardScaleStart.exercises;

    const canScaleStars =
        starsTarget >= rewardScaleStart.stars;

    const practiceTimeTier = practiceTimeTiers[practiceTimeTarget];
    const exercisesTier = exerciseTiers[exercisesTarget];
    const starsTier = starTiers[starsTarget];

    if (!practiceTimeTier || !exercisesTier || !starsTier) {
        throw new Error("Invalid challenge target");
    }

    const dataArr = [practiceTimeTier,exercisesTier,starsTier];
    const dataCanScale = [canScalePracticeTime,canScaleExercises,canScaleStars];
    const keys = ["practiceTime", "exercises", "stars"];

    return dataArr.reduce((result, tier, index) => {
        if (dataCanScale[index]) {
            result[keys[index]] = {
                canScale: true,
                checkpoint30: checkpointRewards.checkpoint30 * tier,
                checkpoint70: checkpointRewards.checkpoint70 * tier,
                completion: checkpointRewards.completion * tier,
            };
        } else {
            result[keys[index]] = {
                canScale: false,
                completion: 1,
            };
        }

        return result;
    }, {});
};
export const getRandomReward = () => {
    const items = Object.values(commonRewards);

    const totalWeight = items.reduce(
        (sum, item) => sum + item.weight,
        0
    );

    let random = Math.floor(Math.random() * totalWeight);

    for (const item of items) {
        random -= item.weight;

        if (random < 0) {
            return item;
        }
    }
};
export const calculateRewarDailyChallengeAmount = (practiceTime,exercises,stars)=>{
    //user nhận BAO NHIÊU?
    const multiplier = getRewardScale(practiceTime,exercises,stars);
    const checkpoints = ["checkpoint30", "checkpoint70", "completion"];

    const createRewards = (key) => {
        const canScale = multiplier[key].canScale;

        return checkpoints
            .filter(checkpoint => canScale || checkpoint === "completion")
            .reduce((result, checkpoint) => {
                const rewards = getRandomReward();

                result[checkpoint] = {
                    rewardType: rewards.rewardType,
                    amount: Math.floor(
                        rewards.baseAmount * multiplier[key][checkpoint]
                    )                
                };

                return result;
            }, {
                canScale
            });
    };
    const rewardPracticeTime = createRewards("practiceTime");
    const rewardExercises = createRewards("exercises");
    const rewardStars = createRewards("stars");

    return {
        rewardPracticeTime,
        rewardExercises,
        rewardStars,
    };
}

export const createDailyChallenge = async (userId, targets) => {
    const tomorrow = new Date();

    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    if (
        !ALLOWED_PRACTICE_TIMES.includes(targets.practiceTime) ||
        !ALLOWED_EXERCISES.includes(targets.exercises) ||
        !ALLOWED_STARS.includes(targets.stars)
    ) {
        throw new Error("target nam o ngoai pham vi dc cho phep")
    }
    const rewards = calculateRewarDailyChallengeAmount(
        targets.practiceTime,
        targets.exercises,
        targets.stars
    );

    return await DailyChallenge.create({
        userId,
        date: tomorrow,

        targets,

        progress: {
            practiceTime: 0,
            exercises: 0,
            stars: 0
        },

        rewards: {
            practiceTime: {
                canScale: rewards.rewardPracticeTime.canScale,
                checkpoint30: rewards.rewardPracticeTime.checkpoint30,
                checkpoint70: rewards.rewardPracticeTime.checkpoint70,
                completion: rewards.rewardPracticeTime.completion
            },

            exercises: {
                canScale: rewards.rewardExercises.canScale,
                checkpoint30: rewards.rewardExercises.checkpoint30,
                checkpoint70: rewards.rewardExercises.checkpoint70,
                completion: rewards.rewardExercises.completion
            },

            stars: {
                canScale: rewards.rewardStars.canScale,
                checkpoint30: rewards.rewardStars.checkpoint30,
                checkpoint70: rewards.rewardStars.checkpoint70,
                completion: rewards.rewardStars.completion
            }
        },

        claimed: {
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
        }
    });
};
export const claimReachedDailyRewards = async (
    userId,
    progress,
    session
) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const challenge = await DailyChallenge.findOne({
        userId,
        date: { $lte: today }
    })
    .sort({ date: -1 })
    .session(session);

    if (!challenge) {
        throw new Error("Daily challenge not found");
    }

    challenge.progress = progress;

    return challenge;
};
export const rewardDailyChallenge = async (
    challenge,
    userId,
    progress,
    session
) => {
    const factor = [0.3, 0.7, 1];

    const checkpoints = [
        "checkpoint30",
        "checkpoint70",
        "completion"
    ];

    const keys = [
        "practiceTime",
        "exercises",
        "stars"
    ];

    const receivedRewards = [];

    for (let index = 0; index < keys.length; index++) {
        const key = keys[index];

        const target = challenge.targets[key];

        const canScale =
            target >= rewardScaleStart[key];

        const checkpointCount = canScale ? 3 : 1;

        for (let i = 0; i < checkpointCount; i++) {
            const checkpoint = checkpoints[i];

            const requiredProgress =
                Math.floor(target * factor[i]);

            const reached =
                progress[key] >= requiredProgress;

            const alreadyClaimed =
                challenge.claimed[key][checkpoint];

            if (!reached || alreadyClaimed) {
                continue;
            }

            const reward =
                challenge.rewards[key][checkpoint];

            const rewardType =
                reward.rewardType;

            const rewardAmount =
                reward.amount;

            // ===== REWARD =====

            if (
                ["COIN", "GEM"].includes(
                    rewardType.toUpperCase()
                )
            ) {
                await changeCurrency({
                    userId,
                    currency: rewardType.toUpperCase(),
                    amount: rewardAmount,
                    type: "ADD",
                    reason: "DAILY_REWARD",
                    session
                });
            } else {
                await changeInventory({
                    userId,
                    itemId: rewardType,
                    amount: rewardAmount,
                    type: "ADD",
                    session
                });
            }

            // ===== CLAIM =====

            challenge.claimed[key][checkpoint] = true;

            // ===== RECORD REWARD =====

            receivedRewards.push({
                key,
                checkpoint,
                rewardType,
                amount: rewardAmount
            });
        }
    }

    return receivedRewards;
};
