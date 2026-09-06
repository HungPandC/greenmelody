import { RESERVED_USERNAME_WORDS } from "../constants.js";

const LEET_MAP: Record<string, string> = {
    "0": "o",
    "1": "i",
    "3": "e",
    "4": "a",
    "5": "s",
    "7": "t",
};

function removeSeparators(value: string): string {
    return value.replace(/[\s_.-]/g, "");
}

function normalizeLeet(value: string): string {
    return value
        .split("")
        .map(char => LEET_MAP[char] ?? char)
        .join("");
}

export function detectObfuscation(username: string): boolean {
    const normalizedUsername = username.toLowerCase();

    const compact = removeSeparators(normalizedUsername);
    const leet = normalizeLeet(compact);

    return RESERVED_USERNAME_WORDS.some(word =>
        leet === word
    );
}