import type {
    UsernameModerationResult,
    ModerationReason
} from "./types.js";
import { checkProfanity } from "./rules/profanity.js";
import { checkReservedUsername } from "./rules/reserved.js";
import { checkImpersonation } from "./rules/impersonation.js";
import { detectObfuscation } from "./obfuscation/detectObfuscation.js";
export function moderateUsername(
    username: string
): UsernameModerationResult {

    const reasons: ModerationReason[] = [];

    if (checkReservedUsername(username)) {
        reasons.push("RESERVED_NAME");
    }
    if (checkProfanity(username)) {
        reasons.push("PROFANITY");
    }
    if (checkImpersonation(username)) {
        reasons.push("IMPERSONATION");
    }
    if (detectObfuscation(username)) {
        reasons.push("OBFUSCATION");
    }
    if (reasons.length > 0) {
        return {
            decision: "REJECT",
            reasons,
            score: 100,
        };
    }
    return {
        decision: "ALLOW",
        reasons: [],
        score: 0,
    };
}