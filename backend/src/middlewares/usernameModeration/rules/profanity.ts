// rules/profanity.ts
import type { ModerationMatch } from "../types.js";
import { PROFANITY_WORDS } from "../profanityWords.generated.js";
import { tokenizeUsername } from "./tokenize.js";

// severity 4 -> HIGH (~70 điểm), severity 5 -> SEVERE (~85 điểm)
// (scoring.ts tra bảng điểm theo severity này)
function severityToLevel(severity: 4 | 5): "HIGH" | "SEVERE" {
    return severity === 5 ? "SEVERE" : "HIGH";
}

export function checkProfanity(username: string): ModerationMatch[] {
    const tokens = tokenizeUsername(username);

    const matches: ModerationMatch[] = [];

    for (const token of tokens) {
        const severity = PROFANITY_WORDS[token];
        if (severity === undefined) continue;

        matches.push({
            type: "PROFANITY",
            language: "unknown",
            severity: severityToLevel(severity),
            confidence: 1,
        });
    }

    return matches;
}