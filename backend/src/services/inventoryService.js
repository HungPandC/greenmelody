import Inventory from "../models/Inventory.js";
import mongoose from "mongoose";

const validateAmount = (amount) => {
    if (!Number.isInteger(amount) || amount <= 0) {
        throw new Error("Invalid amount");
    }
};

export const changeInventory = async ({
    userId,
    itemId,
    amount,
    type,
    session: externalSession
}) => {

    validateAmount(amount);

    if (!itemId || typeof itemId !== "string") {
        throw new Error("Invalid item");
    }

    if (!["ADD", "USE"].includes(type)) {
        throw new Error("Invalid inventory transaction type");
    }

    const session = externalSession ?? await mongoose.startSession();

    const isOwnSession = !externalSession;

    try {

        if (isOwnSession) {
            session.startTransaction();
        }

        let updatedInventory;

        // ================= USE =================

        if (type === "USE") {

            updatedInventory = await Inventory.findOneAndUpdate(
                {
                    userId,
                    [`items.${itemId}`]: {
                        $gte: amount
                    }
                },
                {
                    $inc: {
                        [`items.${itemId}`]: -amount
                    }
                },
                {
                    new: true,
                    session
                }
            );

            if (!updatedInventory) {
                throw new Error(`Not enough ${itemId}`);
            }

            const remainingAmount =
                updatedInventory.items.get(itemId) ?? 0;

            if (remainingAmount === 0) {

                await Inventory.updateOne(
                    {
                        _id: updatedInventory._id
                    },
                    {
                        $unset: {
                            [`items.${itemId}`]: ""
                        }
                    },
                    {
                        session
                    }
                );

                updatedInventory.items.delete(itemId);
            }

        // ================= ADD =================

        } else {

            updatedInventory = await Inventory.findOneAndUpdate(
                {
                    userId
                },
                {
                    $inc: {
                        [`items.${itemId}`]: amount
                    }
                },
                {
                    new: true,
                    upsert: true,
                    session
                }
            );

            if (!updatedInventory) {
                throw new Error("Inventory update failed");
            }
        }

        if (isOwnSession) {
            await session.commitTransaction();
        }

        return updatedInventory;

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