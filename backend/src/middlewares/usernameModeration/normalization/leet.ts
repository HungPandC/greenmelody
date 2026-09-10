const LEET_MAP: Record<string, string> = {
    "0": "o",
    "1": "i",
    "3": "e",
    "4": "a",
    "5": "s",
    "7": "t",
    "@": "a",
    "$": "s",
    "!": "i",
};

export function normalizeLeet(value: string): string {
    return value
        .split("")
        .map(char => LEET_MAP[char] ?? char)
        .join("");
}