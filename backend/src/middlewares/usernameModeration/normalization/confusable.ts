import { CONFUSABLE_MAP } from "../confusable-map/confusableMap.generated.js";

export function normalizeConfusable(username: string): string {
    return username
        .split("")
        .map(char => CONFUSABLE_MAP[char] ?? char)
        .join("");
}
