import mongoose from 'mongoose';
import { log } from 'node:console';

export const connectDB = async ()=> {
    try{
        await mongoose.connect(process.env.MONGODB_URI);

        console.log("✅ MongoDB đã kết nối thành công");
    } catch (error) {
        console.log(process.env.MONGODB_URI);
        
        console.error("❌ Kết nối MongoDB thất bại:", error.message);
        process.exit(1);
    }
}
