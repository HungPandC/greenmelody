import type {
    UsernameModerationResult,
    ModerationReason
} from "./types.js";

import { collectModerationSignals } from "./collectModerationSignals.js";

import { normalizeConfusable } from "./normalization/confusable.js";

import { normalizeLeet } from "./normalization/leet.js";
import { removeSeparators } from "./normalization/separator.js";


export function moderateUsername(
    username: string
): UsernameModerationResult {
const confusableNormalized = normalizeConfusable(username);

const leetNormalized = normalizeLeet(confusableNormalized);

const separatorNormalized = removeSeparators(leetNormalized);

const normalizedUsername = separatorNormalized.toLowerCase();

    const signals = collectModerationSignals(
        normalizedUsername,
        username
    );

    throw new Error("Scoring not implemented yet");
}