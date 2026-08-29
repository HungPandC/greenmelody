import { Router } from "express";
import { 
    authenticate,
} from "../middlewares/userValidation.js";
import { setNewDailyChallenge } from "../controllers/dailyChallenge.controller.js";
import { validateDailyChallengeTargets } from "../middlewares/dailyChallengeValidation.js";
const router = Router();
router.post(
    "/set-daily-challenge",
    authenticate,
    validateDailyChallengeTargets,
    setNewDailyChallenge
)
export default router;