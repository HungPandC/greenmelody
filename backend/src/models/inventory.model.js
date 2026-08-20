import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
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

const Inventory = mongoose.model("Inventory", inventorySchema);

export default Inventory;