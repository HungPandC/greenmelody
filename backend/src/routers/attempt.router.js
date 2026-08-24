import { Router } from "express";
import { authenticate } from "../middlewares/userValidation";
import { startAttemptController, submitAnswerController } from "../controllers/attempt.controller";
import { getSkill } from "../controllers/getSkill.controller";


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