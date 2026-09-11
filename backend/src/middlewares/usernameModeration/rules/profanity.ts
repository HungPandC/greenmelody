// rules/profanity.ts
import type { ModerationMatch } from "../types.js";
import { PROFANITY_WORDS } from "../profanityWords.generated.js";
import { tokenizeUsername } from "./tokenize.js";

const PROFANITY_SET: Set<string> = new Set(PROFANITY_WORDS);

export function checkProfanity(username: string): ModerationMatch[] {
    const found = tokenizeUsername(username).some(token => PROFANITY_SET.has(token));

    if (!found) return [];

    return [{
        type: "PROFANITY",
        language: "unknown",
        severity: "MEDIUM",
        confidence: 1,
    }];
}