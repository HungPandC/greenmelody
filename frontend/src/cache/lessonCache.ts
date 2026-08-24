import type { Lesson } from "../types/lesson";

const lessonCache = new Map<string, Lesson[]>();

export function getLessonCache(skill: string) {
    return lessonCache.get(skill);
}

export function setLessonCache(
    skill: string,
    lessons: Lesson[]
) {
    lessonCache.set(skill, lessons);
}

export function clearLessonCache(skill: string) {
    lessonCache.delete(skill);
}