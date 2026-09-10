import { IMPERSONATION_WORDS } from "../constants.js";
import { tokenizeUsername } from "./tokenize.js";
import { checkBrandAuthorityPattern } from "./impersonationPatterns.js";

export function checkImpersonation(username: string): boolean {
    const normalizedUsername = username;

    const tokens = tokenizeUsername(normalizedUsername);

    const hasAuthorityToken = IMPERSONATION_WORDS.some(word =>
        tokens.includes(word)
    );

    const matchesBrandAuthority =
        checkBrandAuthorityPattern(normalizedUsername);

    return hasAuthorityToken || matchesBrandAuthority;
}
