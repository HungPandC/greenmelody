export type ChallengeTarget = {
    practiceTime: number; // phút
    exercises: number;
    stars: number;
};

export type ChallengeProgress = {
    practiceTime: number;
    exercises: number;
    stars: number;
};

export const defaultTarget: ChallengeTarget = {
    practiceTime: 15,
    exercises: 3,
    stars: 10,
};

export const mockProgress: ChallengeProgress = {
    practiceTime: 8,
    exercises: 2,
    stars: 6,
};

export const dailyChallenges = [
    {
        id: "d1",
        icon: "🎯",
        title: "Hoàn thành 3 bài học",
        current: 2,
        total: 3,
        xp: 20,
        coin: 30,
    },
    {
        id: "d2",
        icon: "🎤",
        title: "Đọc đúng 10 nốt ở khoá Sol",
        current: 6,
        total: 10,
        xp: 20,
        coin: 30,
    },
];
