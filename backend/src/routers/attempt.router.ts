import { Router } from "express";
import { authenticate } from "../middlewares/userValidation.js";
import { startAttemptController, submitAnswerController } from "../controllers/attempt.controller.js";
import { getSkill } from "../controllers/getSkill.controller.js";


const router = Router();

router.post(
    "/attempt/:skill/:lessonId/start",
    authenticate,
    startAttemptController,
)
router.post(
    "/attempt/:attemptId/:questionIndex/submit",
    authenticate,
    submitAnswerController,
)
router.get(
    "/lesson/:skill",
    authenticate,
    getSkill   
)
export default router;