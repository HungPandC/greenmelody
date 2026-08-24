import { pitch } from "../data/Eartraining/pitch";
import { bassline } from "../data/Eartraining/bassline";
import { melody } from "../data/Eartraining/melody";
import { interval } from "../data/Eartraining/interval";
import { chord } from "../data/Eartraining/chord";
import { scale } from "../data/Eartraining/scale";
import { Allskill }  from "../data/Allskill"

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