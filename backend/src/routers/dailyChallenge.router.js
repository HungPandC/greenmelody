import { Router } from "express";
import { 
    authenticate,
} from "../middlewares/userValidation";
import { setNewDailyChallenge } from "../controllers/dailyChallenge.controller";
import { validateDailyChallengeTargets } from "../middlewares/dailyChallengeValidation";
const router = Router();
router.post(
    "/set-daily-challenge",
    authenticate,
    validateDailyChallengeTargets,
    setNewDailyChallenge
)