// Danh sách skill dùng chung giữa frontend (routing, hiển thị) và backend
// (field "skill" trong lesson/attempt data). Thêm skill mới thì chỉ sửa ở đây.
export const SKILL_IDS = [
    "interval",
    "pitch",
    "chord",
    "scale",
    "melody",
    "bassline",
    "piano",
    "rhythm",
    "note-reading",
    "rhythm-reading",
    "symbol-recognition",
] as const;

export type SkillId = typeof SKILL_IDS[number];
