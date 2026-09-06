import { RESERVED_USERNAME_WORDS } from "../constants.js";

export function checkReservedUsername(username: string): boolean {
    const normalized = username.toLowerCase();

    return RESERVED_USERNAME_WORDS.some(
        word => normalized === word
    );
}