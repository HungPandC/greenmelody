import { analyzeUsernameContext } from "./context.js";
import { detectObfuscation } from "./obfuscation.js";
import { checkImpersonation } from "./rules/impersonation.js";
import { checkProfanity } from "./rules/profanity.js";
import { checkReservedUsername } from "./rules/reserved.js";
import type { ModerationSignals } from "./types.js";

export function collectModerationSignals(
    normalizedUsername: string,
    originalUsername: string
): ModerationSignals {

    const context = analyzeUsernameContext(normalizedUsername);

    return {
        reserved: checkReservedUsername(normalizedUsername),
        profanity: checkProfanity(normalizedUsername),
        impersonation: checkImpersonation(normalizedUsername),
        obfuscation: detectObfuscation(originalUsername),
        hasAuthoritySubstring: context.hasAuthoritySubstring,
        hasBrand: context.hasBrand,
        hasBrandAuthority: context.hasBrandAuthority,
    };
}
