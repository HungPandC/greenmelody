import { Router } from "express";
import { 
    authenticate,
} from "../middlewares/userValidation";
import { setNewDailyChallenge } from "../controllers/dailyChallengeController";

const router = Router();
router.post(
    "/set-daily-challenge",
    authenticate,
    setNewDailyChallenge
)