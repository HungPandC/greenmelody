export type PitchQuestionType = 
    | "direction"     // lên / xuống
    | "compare"       // cao hơn / thấp hơn / bằng
    | "highestLowest"       // cao nhất / thấp nhất
    | "findDuplicate"; // tìm 2 nốt giống nhau
export type PitchLesson = {
        id: string,
        title: string,
        skill: string,
        order: number,
        BaseDifficultyOctave : "easy" | "medium" | "hardHight" | "hardLow" | "extreme",
        BaseDifficultyDistance : "easy" | "medium" | "hard",
        type: PitchQuestionType,
}