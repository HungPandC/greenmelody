import dotenv from "dotenv";
dotenv.config();


import express from "express";
import cors from "cors";
import { connectDB } from "./src/libs/db.js";
import User from "./src/routers/userRounters.js"
import cookieParser from "cookie-parser";

 
const PORT = process.env.PORT || 3000;
 
const app = express();
 
await connectDB();
 
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use("/",User)
 
app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});