import scholarsMate from '../data/scholars-mate.json'
import viennaGambit from '../data/vienna-gambit.json'
import viennaGame from '../data/vienna-game.json'


import type { Lesson } from './types'

export const LESSONS: Lesson[] = [
    scholarsMate as Lesson,
    viennaGambit as Lesson,
    viennaGame as Lesson
    ]

export function getLessonById(id: string): Lesson | undefined {
  return LESSONS.find((l) => l.lessonId === id)
}

export function getLessons(): Lesson[] {
  return LESSONS
}

export function getLessonStats(lesson: Lesson) {
  const exerciseCount = lesson.exercises.length
  const totalPlies = lesson.exercises.reduce((sum, ex) => sum + ex.script.length, 0)
  const totalUserMoves = lesson.exercises.reduce(
    (sum, ex) => sum + ex.script.filter(p => p.actor === 'user').length,
    0
  )

  return { exerciseCount, totalPlies, totalUserMoves }
}