import {
    BRAND_WORDS,
    IMPERSONATION_WORDS
} from "../constants.js";

export function checkBrandAuthorityPattern(username: string): boolean {

    return BRAND_WORDS.some(brand =>
        IMPERSONATION_WORDS.some(word =>
            username === `${brand}${word}` ||
            username === `${word}${brand}`
        )
    );

}