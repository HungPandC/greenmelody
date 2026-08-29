import { pitch } from "../data/Eartraining/pitch.ts";
import { bassline } from "../data/Eartraining/bassline.ts";
import { melody } from "../data/Eartraining/melody.ts";
import { interval } from "../data/Eartraining/interval.ts";
import { chord } from "../data/Eartraining/chord.ts";
import { scale } from "../data/Eartraining/scale.ts";
import { Allskill }  from "../data/Allskill.ts"

export const getSkill = async (req, res) => {
    const { skill } = req.params;

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