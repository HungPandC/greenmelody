import mongoose from "mongoose";

const coinHistorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    amount: {
        type: Number,
        required: true
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


export default mongoose.model("CoinHistory", coinHistorySchema);