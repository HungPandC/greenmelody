
import express from "express";
import cors from "cors";
import { connectDB } from "./src/libs/db.js";
import User from "./src/routers/userRounters.js"
import cookieParser from "cookie-parser";
import helmet from "helmet";

 
const PORT = process.env.PORT || 3000;
 
const app = express();
 
await connectDB();
app.use(helmet());

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"]
}));

app.use(express.json({
    limit: "50kb"
}));

app.use(express.urlencoded({
    extended: true,
    limit: "50kb"
}));
app.use(cookieParser());
app.use("/",User)
 
app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});