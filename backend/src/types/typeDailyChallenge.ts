import mongoose from "mongoose";
import type { ClientSession } from "mongoose";

import {
    allowedExercises,
    allowedStars,
    allowedPracticeTimes
} from "../middlewares/dailyChallengeValidation.js";


// ====================
// Target
// ====================

export type DailyChallengeTargetInput = {
    practiceTimeTarget: typeof allowedPracticeTimes[number];
    exercisesTarget: typeof allowedExercises[number];
    starsTarget: typeof allowedStars[number];
};

export type DailyChallengeTargets = {
    practiceTime: number;
    exercises: number;
    stars: number;
};


// ====================
// Progress
// ====================

export type DailyChallengeProgress = {
    practiceTime: number;
    exercises: number;
    stars: number;
};


// ====================
// Reward
// ====================

export type RewardKey =
    | "practiceTime"
    | "exercises"
    | "stars";

export const keys: RewardKey[] = [
    "practiceTime",
    "exercises",
    "stars"
];


export type CheckpointKey =
    | "checkpoint30"
    | "checkpoint70"
    | "completion";

export const checkpoints: CheckpointKey[] = [
    "checkpoint30",
    "checkpoint70",
    "completion"
];


export type RewardType =
    | "coin"
    | "gem"
    | "wateringCan";


export type RewardAmount = {
    rewardType: RewardType;
    amount: number;
};


export type Reward =
    | {

        canScale: true;
        checkpoint30: number;
        checkpoint70: number;
        completion: number;

    }
    | {
        canScale: false;
        completion: number;
    };


export type RewardResult =
    | {
        canScale: true;
        checkpoint30: RewardAmount;
        checkpoint70: RewardAmount;
        completion: RewardAmount;
    }
    | {
        canScale: false;
        completion: RewardAmount;
    };

export type DailyChallengeReward = {
    canScale: boolean;
    checkpoint30?: RewardAmount;
    checkpoint70?: RewardAmount;
    completion: RewardAmount;
};
type RewardProgress = {
    canScale: boolean;
    checkpoint30: RewardAmount;
    checkpoint70: RewardAmount;
    completion: RewardAmount;
};


export type DailyChallengeRewards = {
    practiceTime: RewardProgress;
    exercises: RewardProgress;
    stars: RewardProgress;
};


// ====================
// Claimed
// ====================

export type ClaimedProgress = {
    checkpoint30: boolean;
    checkpoint70: boolean;
    completion: boolean;
};


export type DailyChallengeClaimed = {
    practiceTime: ClaimedProgress;
    exercises: ClaimedProgress;
    stars: ClaimedProgress;
};


// ====================
// Daily Challenge
// ====================

export interface DailyChallengeModel {
    userId: mongoose.Types.ObjectId;
    date: Date;
    targets: DailyChallengeTargets;
    progress: DailyChallengeProgress;
    rewards: DailyChallengeRewards;
    claimed: DailyChallengeClaimed;
    createdAt: Date;

}
// ====================
// Challenge Context
// ====================
export type ClaimRewardContext = {
    userId: mongoose.Types.ObjectId;
    progress: number;
    session: ClientSession;
};
export type ChallengeContext = {
    userId: mongoose.Types.ObjectId;
    progress: DailyChallengeProgress;
    session: ClientSession;
};

export type ChallengeContextWithChallenge =
    ChallengeContext & {
        challenge: DailyChallengeModel;
    };
// ====================
// Random Reward
// ====================

export type RandomReward = {

    rewardType: RewardType;

    baseAmount: number;

    weight: number;

};
export type receivedReward = {
    key: RewardKey;
    checkpoint: CheckpointKey;
    rewardType: RewardType;
    amount: number;
}