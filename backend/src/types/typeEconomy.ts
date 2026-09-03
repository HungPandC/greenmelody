import mongoose, { ClientSession } from 'mongoose';
export type changeCurrencyType = {
    userId: mongoose.Types.ObjectId;
    currency: "COIN" | "GEM";
    amount: number;
    type: "ADD" | "SPEND";
    reason: string;
    session: ClientSession;
};

export type currencyActionType = Omit<
    changeCurrencyType,
    "currency" | "type"
> & {
    reason?: string;
};