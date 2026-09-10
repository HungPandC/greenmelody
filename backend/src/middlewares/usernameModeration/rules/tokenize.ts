export function tokenizeUsername(username: string): string[] {
    return username.split(/[\s_.-]+/);
}
