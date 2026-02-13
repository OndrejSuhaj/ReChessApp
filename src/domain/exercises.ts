import scholarsMate from '../data/scholars-mate.json'
import viennaGambit from '../data/vienna-gambit.json'
import type { Lesson } from './types'

export const LESSONS: Lesson[] = [
    scholarsMate as Lesson,
    viennaGambit as Lesson,]

export function getLessonById(id: string): Lesson | undefined {
  return LESSONS.find((l) => l.lessonId === id)
}

export function getLessons(): Lesson[] {
  return LESSONS
}