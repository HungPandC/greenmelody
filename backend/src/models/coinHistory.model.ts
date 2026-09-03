import mongoose from "mongoose";

interface CoinHistory {
    userId: mongoose.Types.ObjectId;
    amount: number;
    type: "ADD" | "SPEND";
    currency: "COIN" | "GEM";
    reason: string;
}

const coinHistorySchema = new mongoose.Schema<CoinHistory>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    amount: {
        type: Number,
        required: true,
        min: 1
    },

    type: {
        type: String,
        enum: ["ADD", "SPEND"],
        required: true
    },

    currency: {
        type: String,
        enum: ["COIN", "GEM"],
        required: true
    },

    reason: {
        type: String,
        default: "Unknown"
    }

}, {
    timestamps: true
});


export default mongoose.model<CoinHistory>("CoinHistory", coinHistorySchema);