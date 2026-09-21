export type skillLesson = "pitch" | "melody" | "interval" | "bassline" | "chord" | "scale";

export type PitchQuestionType = 
    | "direction"     // lên / xuống
    | "compare"       // cao hơn / thấp hơn / bằng
    | "highestLowest"       // cao nhất / thấp nhất
    | "findDuplicate"; // tìm 2 nốt giống nhau
export interface BaseLesson {
  id: string;
  title: string;
  skill: skillLesson;
  order: number;
  questionCount: number;
  difficulty: "easy" | "medium" | "hard";
}
export type PitchLesson = BaseLesson & {
  skill: "pitch";
  BaseDifficultyOctave:
    | "easy"
    | "medium"
    | "hardHight"
    | "hardLow"
    | "extreme";
  BaseDifficultyDistance:
    | "easy"
    | "medium"
    | "hard";
  type: PitchQuestionType;
};
export type Lesson =
    | PitchLesson
    | BaseLesson