export type ModerationDecision =
    | "ALLOW"
    | "REVIEW"
    | "REJECT";

export type ModerationReason =
    | "RESERVED_NAME"
    | "PROFANITY"
    | "IMPERSONATION"
    | "UNICODE_RISK"
    | "OBFUSCATION"
    | "BRAND_AUTHORITY";

export interface UsernameModerationResult {
    decision: ModerationDecision;
    reasons: ModerationReason[];
    score: number;
}

export interface UnicodeAnalysis {
    hasNonAscii: boolean;
    hasMixedScripts: boolean;
}

// Mức độ nghiêm trọng của 1 match cụ thể.
// Dùng để scoring.ts tra điểm (xem bảng primary signals trong doc).
export type ModerationSeverity = "LOW" | "MEDIUM" | "HIGH" | "SEVERE";

// 1 match cụ thể tìm thấy trong username (từ profanity hoặc impersonation).
export interface ModerationMatch {
    type: ModerationReason;
    language: string;
    severity: ModerationSeverity;
    confidence: number; // 0-1
}

export type ModerationSignals = {
    reserved: boolean;
    obfuscation: boolean;

    // Gộp kết quả từ checkProfanity + checkImpersonation.
    // scoring.ts sẽ lấy match "mạnh nhất" làm primary score,
    // các match còn lại chỉ cộng bonus nhỏ có giới hạn.
    matches: ModerationMatch[];

    hasAuthoritySubstring: boolean;
    hasBrand: boolean;
    hasBrandAuthority: boolean;
};