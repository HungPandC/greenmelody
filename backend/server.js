import express from "express";
import cors from "cors";
import { connectDB } from "./src/libs/db.lib.js";
import cookieParser from "cookie-parser";
import helmet from "helmet";

import userRouter from "./src/routers/user.router.js";
import attemptRouter from "./src/routers/attempt.router.js";
import attemptActivityRouter from "./src/routers/attemptActivity.router.js";
import dailyChallengeRouter from "./src/routers/dailyChallenge.router.js";
import playNoteRouter from "./src/routers/playNote.router.js";

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

app.use("/", userRouter);
app.use("/", attemptRouter);
app.use("/", attemptActivityRouter);
app.use("/", dailyChallengeRouter);
app.use("/", playNoteRouter);

app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});