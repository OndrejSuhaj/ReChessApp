export type Ply = {
  actor: 'user' | 'system'
  uci: string
}

export type Exercise = {
  id: string
  fen: string
  label: string
  script: Ply[]
  successMessage: string
}

export type Lesson = {
  lessonId: string
  title: string
  description?: string
  coverFen?: string
  exercises: Exercise[]
}

export type RunnerState = {
  exerciseIndex: number
  plyIndex: number
  status: string
}