import { RequestHandler } from "express";
import { Allskill } from "../data/music/Allskill.js";
import {skillLesson} from "../types/typeLesson.js";
const VALID_SKILLS = [
    "pitch",
    "melody",
    "interval",
    "bassline",
    "chord",
    "scale",
] as const;

export function isSkill(value: string): value is skillLesson {
    return VALID_SKILLS.includes(value as skillLesson);
}

export const getSkill: RequestHandler<{ skill: string }> = async (req, res) => {
    const { skill } = req.params;

    if (!isSkill(skill)) {
        return res.status(400).json({
            message: "Invalid skill parameter",
        });
    }

    const lessons = Allskill[skill];

    if (!lessons) {
        return res.status(404).json({
            message: "Skill not found",
        });
    }

    return res.json({
        skill,
        lessons,
    });
};