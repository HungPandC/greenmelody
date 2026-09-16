import type { UsernameModerationResult } from "./types.js";

import { collectModerationSignals } from "./collectModerationSignals.js";

import { calculateModerationScore } from "./scoring.js";

import { normalizeUnicode, removeCombiningMarks } from "./normalization/unicode.js";

import { normalizeConfusable } from "./normalization/confusable.js";

import { normalizeLeet } from "./normalization/leet.js";

import { removeSeparators } from "./normalization/separator.js";


export function moderateUsername(
    username: string
): UsernameModerationResult {
const nfkcNormalized = normalizeUnicode(username);

const combiningMarksRemoved = removeCombiningMarks(nfkcNormalized);

const confusableNormalized = normalizeConfusable(combiningMarksRemoved);

const leetNormalized = normalizeLeet(confusableNormalized);

// Bản còn separator - dùng để tokenize theo từng từ (profanity, impersonation)
const tokenizableUsername = leetNormalized.toLowerCase();

const separatorNormalized = removeSeparators(leetNormalized);

// Bản đã xóa separator - dùng để match chính xác (reserved, brand+authority, substring)
const normalizedUsername = separatorNormalized.toLowerCase();

    const signals = collectModerationSignals(
        normalizedUsername,
        tokenizableUsername,
        username
    );

    return calculateModerationScore(signals);
}