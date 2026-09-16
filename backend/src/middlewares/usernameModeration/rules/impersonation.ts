import { IMPERSONATION_WORDS } from "../constants.js";
import { tokenizeUsername } from "./tokenize.js";
import type { ModerationMatch } from "../types.js";

// Chỉ check token = đúng 1 từ authority (admin, official, ...).
// hasBrandAuthority (brand + authority ghép) đã được context.ts xử lý riêng
// trên bản normalizedUsername (đã xóa separator) - không lặp lại ở đây.
export function checkImpersonation(username: string): ModerationMatch[] {
    const tokens = tokenizeUsername(username);

    const hasAuthorityToken = IMPERSONATION_WORDS.some(word =>
        tokens.includes(word)
    );

    if (!hasAuthorityToken) return [];

    return [{
        type: "IMPERSONATION",
        language: "unknown",
        severity: "HIGH",
        confidence: 1,
    }];
}
