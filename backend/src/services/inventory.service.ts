import Inventory,{InventoryDocument} from "../models/inventory.model.js";
import mongoose, { ClientSession } from "mongoose";

const validateAmount = (amount:number) => {
    if (!Number.isInteger(amount) || amount <= 0) {
        throw new Error("Invalid amount");
    }
};
type changeInventoryType = {
    userId: mongoose.Types.ObjectId,
    itemId: string,
    amount: number,
    type: "ADD" | "USE",
    session: ClientSession
}
export const changeInventory = async ({
    userId,
    itemId,
    amount,
    type,
    session,
}: changeInventoryType): Promise<InventoryDocument> => {

    validateAmount(amount);

    if (!itemId || typeof itemId !== "string") {
        throw new Error("Invalid item");
    }

    if (!["ADD", "USE"].includes(type)) {
        throw new Error("Invalid inventory transaction type");
    }

    const currentSession = session ?? await mongoose.startSession();

    const isOwnSession = !session;

    try {

        if (isOwnSession) {
            currentSession.startTransaction();
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
                    session: currentSession
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
                        session: currentSession
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
                    session: currentSession
                }
            );

            if (!updatedInventory) {
                throw new Error("Inventory update failed");
            }
        }

        if (isOwnSession) {
            await currentSession.commitTransaction();
        }

        return updatedInventory;

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