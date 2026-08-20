import * as createQuestion from "./generators/Pitch.ts"
export const createPitchAttempt = (lesson)=>{
    const type = lesson.type;
    // export type PitchQuestionType = 
    //     | "direction"     // lên / xuống
    //     | "compare"       // cao hơn / thấp hơn / bằng
    //     | "highestLowest"       // cao nhất / thấp nhất
    //     | "findDuplicate"; // tìm 2 nốt giống nhau
    switch (type) {
        case "direction":
            return createQuestion.generatePitchDirectionQuestion(lesson.difficultyOctave ,lesson.difficultyDistance,false)
            break;

        case "compare":
            return createQuestion.generatePitchDirectionQuestion(lesson.difficultyOctave ,lesson.difficultyDistance,true)
            break;
            
        case "highestLowest":
            return createQuestion.generateHighestLowestPitchQuestion(lesson.difficultyOctave ,lesson.difficultyDistance)
            break;

        case "findDuplicate":
            return createQuestion.generateMatchingPitchesQuestion(lesson.difficultyOctave ,lesson.difficultyDistance)
            break;
        default:
            throw new Error(`Invalid pitch question type: ${type}`);        
    }
}