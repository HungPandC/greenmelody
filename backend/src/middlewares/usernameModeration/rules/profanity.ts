import profanity from "allprofanity";

export function checkProfanity(username: string): boolean {
    return profanity.check(username);
}