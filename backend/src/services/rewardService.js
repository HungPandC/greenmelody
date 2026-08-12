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

const baseRewards = {
    coin: 20,
    gem: 2,
    wateringCan: 1
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
export const getRewardScale = async (practiceTime, exercises, stars) => {
    // tính difficulty / reward scale
};
