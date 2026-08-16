// Thông tin TĨNH của user (không đổi theo hành động trong app).
// Số liệu ĐỘNG (coins, xp, gems, streak...) giờ nằm ở GameStateContext/useGameState,
// vì những số đó cần cộng trừ real-time và hiển thị đồng bộ ở nhiều nơi (Topbar, Profile...).
export const mockUser = {
    username: "Hưng",
    email: "hung@example.com",
    avatarLetter: "H",
    level: 1,
    totalStudyTime: "0 phút",
    lessonsCompleted: 0,
    longestStreak: 0,
};

export const mockLeaderboard = [
    { rank: 1, name: "Minh Quân", xp: 1250, avatar: "M" },
    { rank: 2, name: "Khánh Linh", xp: 980, avatar: "K" },
    { rank: 3, name: "Tuấn Anh", xp: 870, avatar: "T" },
    { rank: 4, name: "Hưng (Bạn)", xp: 0, avatar: "H", isMe: true },
];

export const mockAchievements = [
    { icon: "⭐", label: "Chuỗi học dài nhất", value: "0 ngày" },
    { icon: "🕐", label: "Tổng thời gian học", value: "0 phút" },
    { icon: "📗", label: "Bài học đã hoàn thành", value: "0 bài" },
    { icon: "🏆", label: "Thử thách đã hoàn thành", value: "0 thử thách" },
];

// Rỗng vì user mới chưa có hoạt động gì -> Profile page sẽ hiện empty state
export const mockHistory: { icon: string; text: string; xp: number; time: string }[] = [];
