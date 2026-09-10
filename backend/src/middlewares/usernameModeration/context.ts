import {
    BRAND_WORDS,
    IMPERSONATION_WORDS
} from "./constants.js";

import { tokenizeUsername } from "./rules/tokenize.js";

export type UsernameContext = {
    hasAuthoritySubstring: boolean;
    hasBrand: boolean;
    hasBrandAuthority: boolean;
};

export function analyzeUsernameContext(
    username: string
): UsernameContext {

    const hasAuthoritySubstring =
        IMPERSONATION_WORDS.some(word =>
            username.includes(word)
        );

    const hasBrand =
        BRAND_WORDS.some(brand =>
            username.includes(brand)
        );

    const hasBrandAuthority =
        BRAND_WORDS.some(brand =>
            IMPERSONATION_WORDS.some(word =>
                username === `${brand}${word}` ||
                username === `${word}${brand}`
            )
        );

    return {
        hasAuthoritySubstring,
        hasBrand,
        hasBrandAuthority
    };
}
