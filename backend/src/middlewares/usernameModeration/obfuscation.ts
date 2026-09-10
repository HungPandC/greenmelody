import { RESERVED_USERNAME_WORDS } from "./constants.js";
import { normalizeLeet } from "./normalization/leet.js";

import { removeSeparators } from "./normalization/separator.js";

export function detectObfuscation(username: string): boolean {
    const compact = removeSeparators(username);

    const leet = normalizeLeet(compact).toLowerCase();

    return RESERVED_USERNAME_WORDS.some(
        word => leet === word
    );
}
