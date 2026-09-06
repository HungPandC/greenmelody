import { UnicodeAnalysis } from "../types.js";

export function analyzeUnicode(username: string): UnicodeAnalysis {
    const hasNonAscii = /[^\x00-\x7F]/.test(username);

    const hasLatin = /\p{Script=Latin}/u.test(username);
    const hasCyrillic = /\p{Script=Cyrillic}/u.test(username);
    const hasGreek = /\p{Script=Greek}/u.test(username);

    const scriptCount = [
        hasLatin,
        hasCyrillic,
        hasGreek,
    ].filter(Boolean).length;

    return {
        hasNonAscii,
        hasMixedScripts: scriptCount > 1,
    };
}