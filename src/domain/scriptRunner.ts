import { Chess } from 'chess.js'
import type { Exercise } from './types'

export function applyUci(game: Chess, uci: string) {
  return game.move({
    from: uci.slice(0, 2),
    to: uci.slice(2, 4),
    promotion: 'q',
  })
}

export function runSystemPlies(
  game: Chess,
  exercise: Exercise,
  startIndex: number,
  setStatus: (s: string) => void
) {
  let i = startIndex

  while (i < exercise.script.length && exercise.script[i].actor === 'system') {
    const res = applyUci(game, exercise.script[i].uci)
    if (!res) {
      setStatus(`System script illegal: ${exercise.script[i].uci}`)
      return i
    }
    i++
  }

  return i
}