// Mock data cho các module học nhạc.
// Đây là data cho PROTOTYPE — khi có API thật, thay nguồn data ở đây,
// component không cần đổi.

import type { SkillId } from "../../../shared/skills";

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
} satisfies Record<SkillId, { title: string; icon: string; desc: string }>;

// TODO: câu hỏi thật lấy từ attempt backend (createAttempt.service.js), không
// hardcode ở đây nữa.
export const mockExercise: ExerciseQuestion[] = [];