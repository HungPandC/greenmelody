import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
    try {
        await mongoose.connect(process.env.MONGODB_URI as string);

        console.log("✅ MongoDB đã kết nối thành công");
    } catch (error: unknown) {
        console.log(process.env.MONGODB_URI);

        if (error instanceof Error) {
            console.error("❌ Kết nối MongoDB thất bại:", error.message);
        } else {
            console.error("❌ Kết nối MongoDB thất bại:", error);
        }

        process.exit(1);
    }
};