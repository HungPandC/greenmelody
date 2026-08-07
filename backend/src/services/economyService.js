import CoinHistory from "../models/CoinHistory.js";
import mongoose from "mongoose";
import User from "../models/User.js";


const validateAmount = (amount) => {
    if (!Number.isInteger(amount) || amount <= 0) {
        throw new Error("Invalid amount");
    }
};
const changeCurrency = async (userId,currency,amount,type,reason) => {

    validateAmount(amount);

    if (!["COIN", "GEM"].includes(currency)) {
        throw new Error("Invalid currency");
    }

    if (!["ADD", "SPEND"].includes(type)) {
        throw new Error("Invalid transaction type");
    }

    const field = currency === "COIN"
        ? "coin"
        : "gem";

    const session = await mongoose.startSession();

    try {

        session.startTransaction();

        let updatedUser;

        // ================= SPEND =================

        if (type === "SPEND") {

            updatedUser = await User.findOneAndUpdate(
                {
                    _id: userId,
                    [field]: { $gte: amount }
                },
                {
                    $inc: {
                        [field]: -amount
                    }
                },
                {
                    new: true,
                    session
                }
            );

            if (!updatedUser) {
                throw new Error(
                    `Not enough ${currency.toLowerCase()}`
                );
            }
        }

        // ================= ADD =================

        if (type === "ADD") {

            updatedUser = await User.findOneAndUpdate(
                {
                    _id: userId
                },
                {
                    $inc: {
                        [field]: amount
                    }
                },
                {
                    new: true,
                    session
                }
            );

            if (!updatedUser) {
                throw new Error("User not found");
            }
        }

        // ================= HISTORY =================

        await CoinHistory.create(
            [{
                userId,
                amount,
                type,
                currency,
                reason
            }],
            { session }
        );

        await session.commitTransaction();

        return updatedUser;

    } catch (error) {

        await session.abortTransaction();

        throw error;

    } finally {

        await session.endSession();

    }
};

// ================= COIN =================

export const addCoin = (userId, amount, reason = "Add coin") => {
    return changeCurrency(
        userId,
        "COIN",
        amount,
        "ADD",
        reason
    );
};



export const spendCoin = (userId, amount, reason = "Spend coin") => {
    return changeCurrency(
        userId,
        "COIN",
        amount,
        "SPEND",
        reason
    );
};



// ================= GEM =================


export const addGem = (userId, amount, reason = "Add gem") => {
    return changeCurrency(
        userId,
        "GEM",
        amount,
        "ADD",
        reason
    );
};



export const spendGem = (userId, amount, reason = "Spend gem") => {
    return changeCurrency(
        userId,
        "GEM",
        amount,
        "SPEND",
        reason
    );
};

// export const claimDailyReward = async () => {

// }
// export const addPlainXP = async () => {

// }