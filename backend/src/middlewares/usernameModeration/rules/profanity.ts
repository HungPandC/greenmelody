import profanity from "allprofanity";

import type { ModerationMatch } from "../types.js";
import { PROFANITY_WORDS } from "../profanityWords.generated.js";


export function checkProfanity(username: string): ModerationMatch[] {
    const found = PROFANITY_WORDS.some(word =>
        username.includes(word)
    );

    if (!found) {
        return [];
    }

    return [{
        type: "PROFANITY",
        language: "unknown",
        severity: "MEDIUM",
        confidence: 1,
    }];
}