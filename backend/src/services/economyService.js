import CoinHistory from "../models/CoinHistory.js";
import mongoose from "mongoose";
import User from "../models/User.js";


// ================= VALIDATION =================

const validateAmount = (amount) => {
    if (!Number.isInteger(amount) || amount <= 0) {
        throw new Error("Invalid amount");
    }
};


export const changeCurrency = async ({
    userId,
    currency,
    amount,
    type,
    reason,
    session: externalSession
}) => {

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

    const session = externalSession ?? await mongoose.startSession();

    const isOwnSession = !externalSession;

    try {

        if (isOwnSession) {
            session.startTransaction();
        }

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

        // ================= ADD =================

        } else {

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

        if (isOwnSession) {
            await session.commitTransaction();
        }

        return updatedUser;

    } catch (error) {

        if (isOwnSession) {
            await session.abortTransaction();
        }

        throw error;

    } finally {

        if (isOwnSession) {
            await session.endSession();
        }
    }
};


// ================= COIN =================

export const addCoin = ({
    userId,
    amount,
    reason = "Add coin"
}) => {

    return changeCurrency({
        userId,
        currency: "COIN",
        amount,
        type: "ADD",
        reason
    });
};


export const spendCoin = ({
    userId,
    amount,
    reason = "Spend coin"
}) => {

    return changeCurrency({
        userId,
        currency: "COIN",
        amount,
        type: "SPEND",
        reason
    });
};


// ================= GEM =================

export const addGem = ({
    userId,
    amount,
    reason = "Add gem"
}) => {

    return changeCurrency({
        userId,
        currency: "GEM",
        amount,
        type: "ADD",
        reason
    });
};


export const spendGem = ({
    userId,
    amount,
    reason = "Spend gem"
}) => {

    return changeCurrency({
        userId,
        currency: "GEM",
        amount,
        type: "SPEND",
        reason
    });
};


// ================= OTHER REWARDS =================

// export const claimDailyReward = async ({
//     userId,
//     ...
// }) => {
//
// };


// export const addPlainXP = async ({
//     userId,
//     amount
// }) => {
//
// };