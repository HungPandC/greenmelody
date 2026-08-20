import { Router } from "express";
import { 
    authenticate,
} from "../middlewares/userValidation";
import { playAttemptPitch, playNote } from "../controllers/note.controller";
const router = Router();

router.post("/play/note", playNote);
router.post(
    "/attempt/:attemptId/:questionId/play/pitch", 
    playAttemptPitch
);