import { UnicodeAnalysis } from "../types.js";

// normalizeUnicode = Chuẩn hóa Unicode (NFKC)
// Đưa những ký tự Unicode "trang trí" nhưng thực chất
// đại diện cho cùng một ký tự về dạng dễ so sánh hơn.
export function normalizeUnicode(value: string): string {
    return value.normalize("NFKC");
}

// removeCombiningMarks = Xóa các dấu kết hợp
// Ví dụ: Ă -> A + dấu kết hợp
export function removeCombiningMarks(value: string): string {
    return value
        .normalize("NFD")
        .replace(/\p{M}/gu, "");
}

export function analyzeUnicode(username: string): UnicodeAnalysis {
    const hasNonAscii = /[^\x00-\x7F]/.test(username);

    const hasLatin = /\p{Script=Latin}/u.test(username);
    const hasCyrillic = /\p{Script=Cyrillic}/u.test(username);
    const hasGreek = /\p{Script=Greek}/u.test(username);

    const scriptCount = [
        hasLatin,
        hasCyrillic,
        hasGreek,
    ].filter(Boolean).length;

    return {
        hasNonAscii,
        hasMixedScripts: scriptCount > 1,
    };
}
