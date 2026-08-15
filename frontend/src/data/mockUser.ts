// Mock data tập trung — sau này thay bằng API thật (GetProfile() trong profileService.ts)
// thì chỉ cần sửa 1 chỗ, không phải lục từng page.

export const mockUser = {
    username: "Hưng",
    avatarLetter: "H",
    level: 12,
    xp: 450,
    coins: 450,
    gems: 30,
    lives: 3,
    maxLives: 3,
    streak: 5,
    longestStreak: 12,
    totalStudyTime: "4 giờ 32 phút",
    lessonsCompleted: 28,
};

export const mockLeaderboard = [
    { rank: 1, name: "Minh Quân", xp: 1250, avatar: "M" },
    { rank: 2, name: "Khánh Linh", xp: 980, avatar: "K" },
    { rank: 3, name: "Tuấn Anh", xp: 870, avatar: "T" },
    { rank: 4, name: "Hưng (Bạn)", xp: 250, avatar: "H", isMe: true },
];

export const mockAchievements = [
    { icon: "⭐", label: "Chuỗi học dài nhất", value: "12 ngày" },
    { icon: "🕐", label: "Tổng thời gian học", value: "4 giờ 32 phút" },
    { icon: "📗", label: "Bài học đã hoàn thành", value: "28 bài" },
    { icon: "🏆", label: "Thử thách đã hoàn thành", value: "9 thử thách" },
];

export const mockHistory = [
    { icon: "⭐", text: "Hoàn thành bài: Nhận biết quãng 4", xp: 20, time: "2 giờ trước" },
    { icon: "🏆", text: "Hoàn thành thử thách: 3 bài học trong ngày", xp: 30, time: "5 giờ trước" },
    { icon: "🎵", text: "Luyện tập bài: Twinkle Twinkle Little Star", xp: 15, time: "1 ngày trước" },
];
