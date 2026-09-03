import mongoose from "mongoose";
export type Milestone = 50 | 70 | 80 | 90 | 100;

export type MilestoneRewards = Partial<Record<Milestone, number>>;

export interface UserLessonProgress {
    completion: boolean;
    lastPercent?: number;
    highestMilestoneReceived?: Milestone;
    totalRewardCanClaim?: number;
    milestoneRewards: MilestoneRewards;
}
export interface UserLessonModel {
    userId: mongoose.Types.ObjectId;
    lesson: Map<string, UserLessonProgress>;
}