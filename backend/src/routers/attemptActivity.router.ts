import { Router } from "express";
import { authenticate } from "../middlewares/userValidation.js";
import { updateHeartbeat,recordAttemptActivity } from "../controllers/attemptActivity.controller.js";


const router = Router();

router.post(
    "/attempt/:attemptId/heartbeat",
    authenticate,
    updateHeartbeat,
)
router.post(
    "/attempt/:attemptId/action/:type",
    authenticate,
    recordAttemptActivity,
)
export default router;