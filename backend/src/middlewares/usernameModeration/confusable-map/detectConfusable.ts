import { analyzeUnicode } from "../normalization/unicode.js";
import { normalizeConfusable } from "../normalization/confusable.js";

// detectConfusable = Phát hiện ký tự dễ nhầm
// Kiểm tra xem username có dấu hiệu sử dụng Unicode
// để giả dạng ký tự khác hay không.
export function detectConfusable(username: string): boolean {

    const unicode = analyzeUnicode(username);

    if (!unicode.hasNonAscii) {
        return false;
    }

    const normalized = normalizeConfusable(username);

    return normalized !== username;
}
