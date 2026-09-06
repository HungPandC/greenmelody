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
    | "FUZZY_MATCH";

export interface UsernameModerationResult {
    decision: ModerationDecision;
    reasons: ModerationReason[];
    score: number;
}
export interface UnicodeAnalysis {
    hasNonAscii: boolean;
    hasMixedScripts: boolean;
}