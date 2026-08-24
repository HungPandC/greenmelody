// Shape của targets/progress trong daily challenge — dùng chung để frontend
// (type + mock data) và backend (Mongoose schema field "targets"/"progress"
// trong dailyChallenge.model.js) không bị lệch field với nhau.
export type DailyChallengeTargets = {
    practiceTime: number; // phút
    exercises: number;
    stars: number;
};

export type DailyChallengeProgress = DailyChallengeTargets;
