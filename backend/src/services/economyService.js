import CoinHistory from "../models/CoinHistory.js";


const validateAmount = (amount) => {
    if (!Number.isInteger(amount) || amount <= 0) {
        throw new Error("Invalid amount");
    }
};


// ================= COIN =================

export const addCoin = async (userId, coin, reason = "Add coin") => {

    validateAmount(coin);

    const user = await User.findById(userId);

    if (!user) {
        throw new Error("User not found");
    }


    user.coin += coin;

    await user.save();


    await CoinHistory.create({
        userId,
        amount: coin,
        type: "ADD",
        currency: "COIN",
        reason
    });


    return user;
};



export const spendCoin = async (userId, coin, reason = "Spend coin") => {

    validateAmount(coin);


    const user = await User.findById(userId);

    if (!user) {
        throw new Error("User not found");
    }


    if (user.coin < coin) {
        throw new Error("Not enough coins");
    }


    user.coin -= coin;

    await user.save();


    await CoinHistory.create({
        userId,
        amount: coin,
        type: "SPEND",
        currency: "COIN",
        reason
    });


    return user;
};



// ================= GEM =================


export const addGem = async (userId, gem, reason = "Add gem") => {

    validateAmount(gem);


    const user = await User.findById(userId);

    if (!user) {
        throw new Error("User not found");
    }


    user.gem += gem;

    await user.save();



    await CoinHistory.create({
        userId,
        amount: gem,
        type: "ADD",
        currency: "GEM",
        reason
    });


    return user;
};



export const spendGem = async (userId, gem, reason = "Spend gem") => {

    validateAmount(gem);


    const user = await User.findById(userId);


    if (!user) {
        throw new Error("User not found");
    }


    if (user.gem < gem) {
        throw new Error("Not enough gems");
    }


    user.gem -= gem;

    await user.save();



    await CoinHistory.create({
        userId,
        amount: gem,
        type: "SPEND",
        currency: "GEM",
        reason
    });


    return user;
};

export const claimDailyReward = async () => {

}
export const addPlainXP = async () => {

}