// Mock data cho các module học nhạc.
// Đây là data cho PROTOTYPE — khi có API thật, thay nguồn data ở đây,
// component không cần đổi.

export type ExerciseQuestion = {
    id: string;
    question: string;
    options: string[];
    correctIndex: number;
};

export type LessonItem = {
    id: string;
    title: string;
    sub: string;
    locked: boolean;
    current?: boolean;
    completed?: boolean;
};

// Danh sách bài học theo từng skill trong Cảm âm (khớp key với slug trên URL)
export const skillLessons: Record<string, LessonItem[]> = {
    interval: [
        { id: "interval-001", title: "Minor 2", sub: "Quãng 2 thứ", locked: false, current: true },
        { id: "interval-002", title: "Major 2", sub: "Quãng 2 trưởng", locked: true },
        { id: "interval-003", title: "Minor 3", sub: "Quãng 3 thứ", locked: true },
        { id: "interval-004", title: "Major 3", sub: "Quãng 3 trưởng", locked: true },
        { id: "interval-005", title: "Perfect 4", sub: "Quãng 4 đúng", locked: true },
        { id: "interval-006", title: "Perfect 5", sub: "Quãng 5 đúng", locked: true },
    ],
    pitch: [
        { id: "pitch-001", title: "Cao độ 1", sub: "Nốt Đô - Rê - Mi", locked: false, current: true },
        { id: "pitch-002", title: "Cao độ 2", sub: "Nốt Fa - Sol - La", locked: true },
        { id: "pitch-003", title: "Cao độ 3", sub: "Toàn bộ quãng 8", locked: true },
    ],
    chord: [
        { id: "chord-001", title: "Hợp âm trưởng", sub: "Major Chord", locked: false, current: true },
        { id: "chord-002", title: "Hợp âm thứ", sub: "Minor Chord", locked: true },
        { id: "chord-003", title: "Hợp âm 7", sub: "7th Chord", locked: true },
    ],
    scale: [
        { id: "scale-001", title: "Gam trưởng", sub: "Major Scale", locked: false, current: true },
        { id: "scale-002", title: "Gam thứ tự nhiên", sub: "Natural Minor", locked: true },
    ],
    melody: [
        { id: "melody-001", title: "Giai điệu ngắn", sub: "4 ô nhịp", locked: false, current: true },
        { id: "melody-002", title: "Giai điệu trung bình", sub: "8 ô nhịp", locked: true },
    ],
    bassline: [
        { id: "bassline-001", title: "Bassline cơ bản", sub: "Root note", locked: false, current: true },
        { id: "bassline-002", title: "Bassline nâng cao", sub: "Walking bass", locked: true },
    ],
    // Dùng chung engine bài học (SkillLessonList + LessonExercise) cho trang Thực hành
    piano: [
        { id: "piano-001", title: "Vị trí phím Đô", sub: "Làm quen bàn phím", locked: false, current: true },
        { id: "piano-002", title: "Gam Đô trưởng", sub: "5 ngón cơ bản", locked: true },
    ],
    rhythm: [
        { id: "rhythm-001", title: "Nhịp 4/4 cơ bản", sub: "Đếm phách", locked: false, current: true },
        { id: "rhythm-002", title: "Đảo phách", sub: "Syncopation", locked: true },
    ],
    // Đọc nhạc — tách riêng khỏi Thực hành theo yêu cầu, dùng chung engine bài học
    "note-reading": [
        { id: "note-reading-001", title: "Đọc nốt khoá Sol", sub: "Đô - Rê - Mi - Fa - Sol", locked: false, current: true },
        { id: "note-reading-002", title: "Đọc nốt khoá Fa", sub: "Nốt trầm cơ bản", locked: true },
    ],
    "rhythm-reading": [
        { id: "rhythm-reading-001", title: "Đọc tiết tấu cơ bản", sub: "Nốt đen - nốt trắng", locked: false, current: true },
        { id: "rhythm-reading-002", title: "Đọc tiết tấu nâng cao", sub: "Nốt móc đơn - móc kép", locked: true },
    ],
    "symbol-recognition": [
        { id: "symbol-recognition-001", title: "Ký hiệu cơ bản", sub: "Khoá Sol, khoá Fa, dấu lặng", locked: false, current: true },
        { id: "symbol-recognition-002", title: "Ký hiệu nâng cao", sub: "Dấu luyến, dấu nhắc lại", locked: true },
    ],
};

export const skillMeta: Record<string, { title: string; icon: string; desc: string }> = {
    interval: { title: "Quãng", icon: "🎵", desc: "Luyện nghe và nhận biết các loại quãng trong âm nhạc." },
    pitch: { title: "Cao độ", icon: "🎼", desc: "Nhận biết và phân biệt độ cao của các nốt nhạc." },
    chord: { title: "Hợp âm", icon: "🎹", desc: "Nhận biết và phân biệt các hợp âm cơ bản." },
    scale: { title: "Gam âm", icon: "🪜", desc: "Nhận biết các loại gam và âm giai." },
    melody: { title: "Melody", icon: "🎶", desc: "Nhận biết và ghi nhớ đoạn giai điệu." },
    bassline: { title: "Bassline", icon: "🎸", desc: "Nhận biết và phân tích dòng bass." },
    piano: { title: "Piano", icon: "🎹", desc: "Luyện tập chơi piano trên màn hình ảo." },
    rhythm: { title: "Nhịp điệu", icon: "🥁", desc: "Luyện tập cảm nhận và giữ nhịp." },
    "note-reading": { title: "Đọc nốt", icon: "🎼", desc: "Đọc tên và vị trí nốt nhạc trên khuông." },
    "rhythm-reading": { title: "Đọc tiết tấu", icon: "🥁", desc: "Đọc và gõ đúng trường độ nốt nhạc." },
    "symbol-recognition": { title: "Nhận biết ký hiệu", icon: "🔣", desc: "Nhận biết các ký hiệu âm nhạc thường gặp." },
};

// Câu hỏi mock dùng chung cho mọi lesson (prototype, chưa cần khác nhau theo bài)
export const mockExercise: ExerciseQuestion[] = [
    {
        id: "question-001",
        question: "Nghe đoạn âm thanh, đây là quãng gì?",
        options: ["Minor 2", "Major 2", "Minor 3", "Perfect 4"],
        correctIndex: 1,
    },
    {
        id: "question-002",
        question: "Đâu là quãng 2 thứ (Minor 2)?",
        options: ["Đô - Rê", "Đô - Rê♭", "Đô - Mi", "Đô - Fa"],
        correctIndex: 1,
    },
    {
        id: "question-003",
        question: "Chọn quãng có khoảng cách xa nhất trong các đáp án sau",
        options: ["Minor 2", "Major 3", "Perfect 5", "Perfect 4"],
        correctIndex: 2,
    },
];