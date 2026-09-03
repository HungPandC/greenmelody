import CoinHistory from "../models/coinHistory.model.js";
import mongoose from "mongoose";
import User from "../models/user.model.js";
import { changeCurrencyType,currencyActionType } from "../types/typeEconomy.js";
import { ClientSession } from "mongoose";
// ================= VALIDATION =================

const validateAmount = (amount : number) => {
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
    session,
}: changeCurrencyType) => {

    validateAmount(amount);

    if (!["COIN", "GEM"].includes(currency!)) {
        throw new Error("Invalid currency");
    }

    if (!["ADD", "SPEND"].includes(type!)) {
        throw new Error("Invalid transaction type");
    }

    const field = currency === "COIN"
        ? "coin"
        : "gem";

    const currentSession = session ?? await mongoose.startSession();

    const isOwnSession = !session;

    try {

        if (isOwnSession) {
            currentSession.startTransaction();
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
                    session: currentSession
                }

            );

            if (!updatedUser) {

                throw new Error(
                    `Not enough ${currency!.toLowerCase()}`
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
                    session: currentSession
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
            { session: currentSession }
        );

        if (isOwnSession) {
            await currentSession.commitTransaction();
        }

        return updatedUser;

    } catch (error) {

        if (isOwnSession) {
            await currentSession.abortTransaction();
        }

        throw error;

    } finally {

        if (isOwnSession) {
            await currentSession.endSession();
        }
    }
};



// ================= COIN =================

export const addCoin = async ({
    userId,
    amount,
    reason = "Add coin",
    session // FIX: cho phép truyền session để gộp chung transaction với caller
}: currencyActionType) => {

    return changeCurrency({
        userId,
        currency: "COIN",
        amount,
        type: "ADD",
        reason,
        session
    });
};


export const spendCoin = async ({
    userId,
    amount,
    reason = "Spend coin",
    session
}: currencyActionType) => {

    return changeCurrency({
        userId,
        currency: "COIN",
        amount,
        type: "SPEND",
        reason,
        session
    });
};


// ================= GEM =================

export const addGem = async ({
    userId,
    amount,
    reason = "Add gem",
    session
}: currencyActionType) => {

    return changeCurrency({
        userId,
        currency: "GEM",
        amount,
        type: "ADD",
        reason,
        session
    });
};


export const spendGem = async ({
    userId,
    amount,
    reason = "Spend gem",
    session
}: currencyActionType) => {

    return changeCurrency({
        userId,
        currency: "GEM",
        amount,
        type: "SPEND",
        reason,
        session
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