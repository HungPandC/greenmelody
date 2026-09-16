import type {
    ModerationSignals,
    ModerationMatch,
    ModerationReason,
    ModerationDecision,
    UsernameModerationResult,
} from "./types.js";

// Điểm dự kiến cho từng primary signal (xem bảng trong doc, mục 17).
// Có thể điều chỉnh sau khi test benchmark thực tế.
const RESERVED_SCORE = 90;
const BRAND_AUTHORITY_SCORE = 80;
const IMPERSONATION_SCORE = 85;
const PROFANITY_HIGH_SCORE = 70;   // severity 4
const PROFANITY_SEVERE_SCORE = 85; // severity 5

// Bonus cho secondary signals (mục 18) - không tự reject, chỉ cộng thêm.
const OBFUSCATION_BONUS = 8;
const AUTHORITY_SUBSTRING_BONUS = 10;
const BRAND_BONUS = 3;

// Bonus giới hạn cho các match phụ ngoài match mạnh nhất (mục 15).
const ADDITIONAL_MATCH_BONUS_PER_MATCH = 5;
const ADDITIONAL_MATCH_BONUS_CAP = 10;

const REJECT_THRESHOLD = 80;

function matchPrimaryScore(match: ModerationMatch): number {
    if (match.type === "PROFANITY") {
        return match.severity === "SEVERE"
            ? PROFANITY_SEVERE_SCORE
            : PROFANITY_HIGH_SCORE;
    }

    if (match.type === "IMPERSONATION") {
        return IMPERSONATION_SCORE;
    }

    return 0;
}

// Nhận vào ModerationSignals (từ collectModerationSignals.ts),
// trả về UsernameModerationResult { decision, reasons, score }.
export function calculateModerationScore(
    signals: ModerationSignals
): UsernameModerationResult {
    const reasons: ModerationReason[] = [];

    // --- Primary signals: chỉ lấy tín hiệu MẠNH NHẤT, không cộng dồn ---
    let primaryScore = 0;

    if (signals.reserved) {
        primaryScore = Math.max(primaryScore, RESERVED_SCORE);
        reasons.push("RESERVED_NAME");
    }

    if (signals.hasBrandAuthority) {
        primaryScore = Math.max(primaryScore, BRAND_AUTHORITY_SCORE);
        reasons.push("BRAND_AUTHORITY");
    }

    for (const match of signals.matches) {
        primaryScore = Math.max(primaryScore, matchPrimaryScore(match));
        if (!reasons.includes(match.type)) {
            reasons.push(match.type);
        }
    }

    // --- Bonus nhỏ, giới hạn, cho các match phụ (không tính match mạnh nhất) ---
    const additionalMatchBonus = signals.matches.length > 1
        ? Math.min(
            (signals.matches.length - 1) * ADDITIONAL_MATCH_BONUS_PER_MATCH,
            ADDITIONAL_MATCH_BONUS_CAP
        )
        : 0;

    // --- Secondary signals: chỉ cộng thêm, không tự đủ để reject ---
    let secondaryBonus = 0;

    if (signals.obfuscation) {
        secondaryBonus += OBFUSCATION_BONUS;
        reasons.push("OBFUSCATION");
    }

    if (signals.hasAuthoritySubstring) {
        secondaryBonus += AUTHORITY_SUBSTRING_BONUS;
    }

    if (signals.hasBrand) {
        secondaryBonus += BRAND_BONUS;
    }

    const score = Math.min(
        primaryScore + additionalMatchBonus + secondaryBonus,
        100
    );

    // Chỉ ALLOW/REJECT - chưa có REVIEW queue (mục 19).
    const decision: ModerationDecision = score >= REJECT_THRESHOLD
        ? "REJECT"
        : "ALLOW";

    return { decision, reasons, score };
}
