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
export type ModerationMatch = {
    type: "PROFANITY" | "IMPERSONATION";
    language?: string;
    severity?: "LOW" | "MEDIUM" | "HIGH";
    confidence: number;
};
export type ModerationSignals = {
    reserved: boolean;
    obfuscation: boolean;

    matches: ModerationMatch[];

    hasAuthoritySubstring: boolean;
    hasBrand: boolean;
    hasBrandAuthority: boolean;
};
type ProfanityEntry = {
    word: string;
    language: string;
    severity: 1 | 2 | 3 | 4 | 5;
    category: string;
};