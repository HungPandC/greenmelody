export function removeSeparators(username: string): string {
    return username.replace(/[\s_.-]/g, "");
}