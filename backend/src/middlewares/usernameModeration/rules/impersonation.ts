const IMPERSONATION_WORDS = [
    "admin",
    "administrator",
    "support",
    "staff",
    "moderator",
    "official",
];

export function checkImpersonation(username: string): boolean {
    const normalizedUsername = username.toLowerCase();

    return IMPERSONATION_WORDS.some(word =>
        normalizedUsername.includes(word)
    );
}