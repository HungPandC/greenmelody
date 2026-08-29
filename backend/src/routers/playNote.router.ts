import { Router } from "express";
import { 
    authenticate,
} from "../middlewares/userValidation.js";
import { playAttemptPitch, playNote } from "../controllers/note.controller.js";
const router = Router();

router.post("/play/note", playNote);
router.post(
    "/attempt/:attemptId/:questionIndex/play/pitch", 
    playAttemptPitch
);
export default router;