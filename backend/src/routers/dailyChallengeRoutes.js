import { Router } from "express";
import { 
    authenticate,
} from "../middlewares/userValidation";
import { setDailyChallenge } from "../controllers/dailyChallengeController";
import { validateDailyChallengeTargets } from "../middlewares/dailyChallengeValidation";
const router = Router();
router.post(
    "/set-daily-challenge",
    authenticate,
    validateDailyChallengeTargets,
    setDailyChallenge
)