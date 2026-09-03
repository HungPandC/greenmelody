import mongoose from "mongoose";

export interface InventoryDocument {
    userId: mongoose.Types.ObjectId;
    items: Map<string, number>;
}

const inventorySchema = new mongoose.Schema<InventoryDocument>(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },

        items: {
            type: Map,
            of: {
                type: Number,
                min: 0
            },
            default: {}
        }
    },
    {
        timestamps: true
    }
);

const InventoryModel = mongoose.model<InventoryDocument>("Inventory", inventorySchema);

export default InventoryModel;