import * as createQuestion from "./generators/Pitch.js"
import type { PitchLesson,Lesson } from "../types/typeLesson.js";
const isPitchLesson = (lesson: Lesson): lesson is PitchLesson => {
    return lesson.skill === "pitch";
};
export const createAttempt = <T extends Lesson>(lesson: T) => {
    switch (lesson.skill) {
        case "pitch":
            if (isPitchLesson(lesson)) {
                return createPitchAttempt(lesson);
            }

        case "interval":
            // return createIntervalAttempt(lesson);

        case "melody":
            // return createMelodyAttempt(lesson);

        default:
            throw new Error("Unsupported lesson");
    }
};
export const createPitchAttempt = (lesson: PitchLesson) => {

    switch (lesson.type) {

        case "direction":
            return createQuestion.generatePitchDirectionQuestion(
                lesson.BaseDifficultyOctave,
                lesson.BaseDifficultyDistance,
                false
            );

        case "compare":
            return createQuestion.generatePitchDirectionQuestion(
                lesson.BaseDifficultyOctave,
                lesson.BaseDifficultyDistance,
                true
            );

        case "highestLowest":
            return createQuestion.generateHighestLowestPitchQuestion(
                lesson.BaseDifficultyOctave,
                lesson.BaseDifficultyDistance
            );

        case "findDuplicate":
            return createQuestion.generateMatchingPitchesQuestion(
                lesson.BaseDifficultyOctave,
                lesson.BaseDifficultyDistance
            );
    }
};