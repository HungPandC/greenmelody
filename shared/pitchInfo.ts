export interface LessonInfo {
    id: string;
    skill: string;
    title: string;
    sub: string;
    order: number;
}

export const lessonInfo: LessonInfo[] = [
    {
        id: "pitch-001",
        skill: "pitch",
        title: "Nhận biết cao độ cơ bản",
        sub: "Nốt Đô - Rê - Mi",
        order: 1,
    },

    {
        id: "pitch-002",
        skill: "pitch",
        title: "Nhận biết cao độ nâng cao",
        sub: "Nốt Fa - Sol - La",
        order: 2,
    },
];