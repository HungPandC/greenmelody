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

export type ModerationSignals = {
    reserved: boolean;
    profanity: boolean;
    impersonation: boolean;
    obfuscation: boolean;

    hasAuthoritySubstring: boolean;
    hasBrand: boolean;
    hasBrandAuthority: boolean;
};