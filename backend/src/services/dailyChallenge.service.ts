import mongoose from "mongoose";
import { changeCurrency} from "./economy.service.js";
import { changeInventory } from "./inventory.service.js";
import DailyChallenge from "../models/dailyChallenge.model.js";
import {
    receivedReward,
    ClaimRewardContext,
    DailyChallengeReward,
    DailyChallengeTargetInput,
    checkpoints,
    keys,
    Reward,
    RandomReward,
    RewardResult,
    RewardKey,
    ChallengeContextWithChallenge,
    RewardAmount
} from "../types/typeDailyChallenge.js";

import { allowedExercises,allowedStars,allowedPracticeTimes } from "../middlewares/dailyChallengeValidation.js";
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
const commonRewards: Record<string, RandomReward>  = {
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
type Tier = 1 | 2 | 3;
const practiceTimeTiers: Record<typeof allowedPracticeTimes[number], Tier>= {
    5: 1,
    10: 1,
    15: 1,

    20: 2,
    30: 2,
    45: 2,

    60: 3
};

const exerciseTiers: Record<typeof allowedExercises[number], Tier> = {
    3: 1,
    5: 1,
    10: 1,

    15: 2,
    25: 2,
    40: 2,

    60: 3
};

const starTiers: Record<typeof allowedStars[number], Tier> = {
    1: 1,
    2: 1,
    3: 1,

    5: 2,
    8: 2,
    12: 2,

    15: 3
};

const factor = [0.3, 0.7, 1];
const getRewardScale = ({practiceTimeTarget, exercisesTarget, starsTarget}: DailyChallengeTargetInput) => {
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

    return dataArr.reduce<Record<RewardKey, Reward>>(
    (result, tier, index) => {

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

        },
        {} as Record<RewardKey, Reward>
    );
};
export const getRandomReward = (): RandomReward | undefined => {
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

    return undefined;
};
export const calculateRewarDailyChallengeAmount = ({practiceTimeTarget, exercisesTarget, starsTarget}: DailyChallengeTargetInput)=>{
    //user nhận BAO NHIÊU?
    const multiplier = getRewardScale({
        practiceTimeTarget: practiceTimeTarget,
        exercisesTarget : exercisesTarget,
        starsTarget : starsTarget
    });

    const createRewards = (key: RewardKey): RewardResult => {

        const reward = multiplier[key];

        if (!reward.canScale) {

            const rewards = getRandomReward();

            if (!rewards) {
                throw new Error("No reward available");
            }

            return {
                canScale: false,
                completion: {
                    rewardType: rewards.rewardType,
                    amount: rewards.baseAmount
                }
            };
        }

        const result: Extract<RewardResult, { canScale: true }> = {
            canScale: true,
            checkpoint30: {} as RewardAmount,
            checkpoint70: {} as RewardAmount,
            completion: {} as RewardAmount
        };

        for (const checkpoint of checkpoints) {

            const multiplierAmount = reward[checkpoint];

            const rewards = getRandomReward();

            if (!rewards) {
                throw new Error("No reward available");
            }

            result[checkpoint] = {
                rewardType: rewards.rewardType,
                amount: Math.floor(
                    rewards.baseAmount * multiplierAmount
                )
            };
        }

        return result;
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

export const createDailyChallenge = async (userId : mongoose.Types.ObjectId, targets:DailyChallengeTargetInput) => {
    const tomorrow = new Date();

    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    if (
        !allowedPracticeTimes.includes(targets.practiceTimeTarget) ||
        !allowedExercises.includes(targets.exercisesTarget) ||
        !allowedStars.includes(targets.starsTarget)
    ) {
        throw new Error("target nam o ngoai pham vi dc cho phep")
    }
    const rewards = calculateRewarDailyChallengeAmount({
        practiceTimeTarget: targets.practiceTimeTarget,
        exercisesTarget: targets.exercisesTarget,
        starsTarget : targets.starsTarget
    });
    // const practiceTimeobject:RewardProgress  = {};
    // if(rewards.rewardPracticeTime.canScale){
    //     practiceTime.practiceTime = {
    //         canScale: rewards.rewardPracticeTime.canScale,
    //         checkpoint30: rewards.rewardPracticeTime.checkpoint30,
    //         checkpoint70: rewards.rewardPracticeTime.checkpoint70,
    //         completion: rewards.rewardPracticeTime.completion
    //     }
    // }else{
    //     return{
    //         canScale: rewards.rewardPracticeTime.canScale,
    //         completion: rewards.rewardPracticeTime.completion
    //     }
    // }

    const toDailyChallengeReward = (
        reward: RewardResult
    ): DailyChallengeReward => {

        if (reward.canScale) {
            return reward;
        }

        return {
            canScale: false,
            completion: reward.completion
        };
    };
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
            practiceTime: toDailyChallengeReward(rewards.rewardPracticeTime),
            exercises: toDailyChallengeReward(rewards.rewardExercises),
            stars: toDailyChallengeReward(rewards.rewardStars)
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
export const claimReachedDailyRewards = async ({
    userId,
    progress,
    session
}:ClaimRewardContext,key : RewardKey) => {
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

    challenge.progress[key] = progress;

    return challenge;
};
export const rewardDailyChallenge = async ({
    challenge,
    userId,
    progress,
    session
}:ChallengeContextWithChallenge) => {
    const receivedRewards:receivedReward[] = [];

    for (const key of keys) {

        const target = challenge.targets[key];

        const canScale =
            target >= rewardScaleStart[key];

        const checkpointCount = canScale ? 3 : 1;

        for (const [i, checkpoint] of checkpoints
            .slice(0, checkpointCount)
            .entries()){

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
            const currency = rewardType.toUpperCase();
            if (
                ["COIN", "GEM"].includes(currency)
            ) {
                await changeCurrency({
                    userId,
                    currency: currency as "COIN" | "GEM",
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
