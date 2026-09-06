// CONFUSABLE_MAP = Bảng ánh xạ các ký tự Unicode dễ nhầm về ký tự chuẩn
const CONFUSABLE_MAP: Record<string, string> = {
    // Cyrillic = Chữ Kirin
    "а": "a",
    "е": "e",
    "о": "o",
    "р": "p",
    "с": "c",
    "х": "x",
    "у": "y",

    // Greek = Chữ Hy Lạp
    "α": "a",
    "β": "b",
    "ε": "e",
    "ι": "i",
    "κ": "k",
    "ο": "o",
    "ρ": "p",
    "τ": "t",
    "χ": "x",
};


// normalizeConfusable = Chuẩn hóa ký tự dễ nhầm
export function normalizeConfusable(username: string): string {
    let result = "";

    for (const char of username) {
        result += CONFUSABLE_MAP[char] ?? char;
    }

    return result;
}