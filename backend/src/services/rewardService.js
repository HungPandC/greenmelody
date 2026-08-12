import { completion } from "yargs";

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
}
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

    const data = {};
    let dataPracticeTime = {}
    //practiceTime
    if(canScalePracticeTime){
        dataPracticeTime = {
            canScale: canScalePracticeTime,
            reward30: checkpointRewards.checkpoint30 * practiceTimeTier,
            reward70: checkpointRewards.checkpoint70 * practiceTimeTier,
            completion: checkpointRewards.completion * practiceTimeTier,
        }
    }else{
        dataPracticeTime = {
            canScale: canScalePracticeTime,
            completion: 1,
        }
    }



    return data;
};
export const getRandomReward = (pool) => {
    //random theo phan tram
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
}
export const calculateRewardAmount = ()=>{
    //user nhận BAO NHIÊU?
    return 
}