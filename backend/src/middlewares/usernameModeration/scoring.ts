import type { ModerationSignals, UsernameModerationResult } from "./types.js";

// TODO: chưa implement.
// Nhận vào ModerationSignals (từ collectModerationSignals.ts),
// trả về UsernameModerationResult { decision, reasons, score }.
export function calculateModerationScore(
    signals: ModerationSignals
): UsernameModerationResult {
    throw new Error("Scoring not implemented yet");
}
