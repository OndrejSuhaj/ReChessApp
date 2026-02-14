// app/(tabs)/lesson/[lessonId].tsx
import { Chess } from 'chess.js'
import { useLocalSearchParams } from 'expo-router'
import React, { useMemo, useState } from 'react'
import { Pressable, Text, View } from 'react-native'

import { getLessonById } from '../../../src/domain/exercises'
import { applyUci } from '../../../src/domain/scriptRunner'
import type { RunnerState } from '../../../src/domain/types'
import { ChessBoard } from '../../../src/ui/ChessBoard'

type MoveResult = 'ok' | 'wrong' | 'illegal'

function replayPlies(game: Chess, script: { actor: string; uci: string }[], count: number) {
  for (let i = 0; i < count; i++) {
    const res = applyUci(game, script[i].uci)
    if (!res) return false
  }
  return true
}

export default function LessonTrainerScreen() {
  const { lessonId } = useLocalSearchParams<{ lessonId?: string }>()
  const safeLessonId = typeof lessonId === 'string' ? lessonId : ''
  const lesson = getLessonById(safeLessonId)

  const [state, setState] = useState<RunnerState>({
    exerciseIndex: 0,
    plyIndex: 0,
    status: 'ready',
  })

  const [lastUci, setLastUci] = useState<string | null>(null)

  if (!lesson || lesson.exercises.length === 0) {
    return (
      <View style={{ padding: 24 }}>
        <Text>Lesson not found.</Text>
      </View>
    )
  }

  // ✅ TypeScript narrowing anchor (lesson is definitely defined from here)
  const safeLesson = lesson

  const exercise = safeLesson.exercises[state.exerciseIndex]
  if (!exercise) {
    return (
      <View style={{ padding: 24 }}>
        <Text>Exercise index out of range.</Text>
      </View>
    )
  }

  // Rebuild the game deterministically from FEN + already accepted plies
  const game = useMemo(() => {
    const g = new Chess(exercise.fen)
    replayPlies(g, exercise.script, state.plyIndex)
    return g
  }, [exercise.id, exercise.fen, state.plyIndex])

  const isFinished = state.plyIndex >= exercise.script.length

  function advanceToNextExercise() {
    setLastUci(null)
    setState((s) => {
      const nextIndex = Math.min(s.exerciseIndex + 1, safeLesson.exercises.length - 1)
      return {
        exerciseIndex: nextIndex,
        plyIndex: 0,
        status: 'ready',
      }
    })
  }

  function restartExercise() {
    setLastUci(null)
    setState((s) => ({
      ...s,
      plyIndex: 0,
      status: 'ready',
    }))
  }

  function handleUci(uci: string): MoveResult {
    if (isFinished) return 'illegal'

    const expected = exercise.script[state.plyIndex]
    if (!expected) return 'illegal'

    if (expected.actor !== 'user') {
      setState((s) => ({ ...s, status: `Expected system move at ply ${s.plyIndex}` }))
      return 'illegal'
    }

    if (uci !== expected.uci) {
      setState((s) => ({ ...s, status: 'wrong move' }))
      return 'wrong'
    }

    // Safety net legality check
    {
      const test = new Chess(game.fen())
      const res = applyUci(test, uci)
      if (!res) {
        setState((s) => ({ ...s, status: `illegal move: ${uci}` }))
        return 'illegal'
      }
    }

    // Accept user's move and auto-run system plies
    const after = new Chess(game.fen())
    applyUci(after, uci)
    setLastUci(uci)

    let nextPlyIndex = state.plyIndex + 1

    while (nextPlyIndex < exercise.script.length) {
      const ply = exercise.script[nextPlyIndex]
      if (ply.actor !== 'system') break

      const res = applyUci(after, ply.uci)
      if (!res) {
        setState((s) => ({
          ...s,
          status: `System script illegal: ${ply.uci}`,
        }))
        setState((s) => ({ ...s, plyIndex: nextPlyIndex }))
        return 'ok'
      }

      setLastUci(ply.uci)
      nextPlyIndex++
    }

    if (nextPlyIndex >= exercise.script.length) {
      setState((s) => ({
        ...s,
        plyIndex: nextPlyIndex,
        status: 'success',
      }))
    } else {
      setState((s) => ({
        ...s,
        plyIndex: nextPlyIndex,
        status: 'ready',
      }))
    }

    return 'ok'
  }

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <View style={{ gap: 4 }}>
        <Text style={{ fontSize: 18, fontWeight: '800' }}>{safeLesson.title}</Text>
        <Text style={{ opacity: 0.8 }}>
          {exercise.label} • Exercise {state.exerciseIndex + 1}/{safeLesson.exercises.length} • Step{' '}
          {Math.min(state.plyIndex + 1, exercise.script.length)}/{exercise.script.length}
        </Text>
      </View>

      <ChessBoard
        game={game}
        onUci={handleUci}
        lastUci={lastUci}
        disabled={state.status === 'success'}
      />

      <View style={{ gap: 8 }}>
        {state.status === 'success' ? (
          <View style={{ padding: 12, borderWidth: 1, borderRadius: 12 }}>
            <Text style={{ fontWeight: '800', fontSize: 16 }}>{exercise.successMessage}</Text>
            <Text style={{ opacity: 0.8, marginTop: 4 }}>
              Completed. {state.exerciseIndex < safeLesson.exercises.length - 1 ? 'Go next?' : 'Lesson done.'}
            </Text>

            <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
              <Pressable
                onPress={restartExercise}
                style={{ paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10, borderWidth: 1 }}
              >
                <Text style={{ fontWeight: '700' }}>Restart</Text>
              </Pressable>

              {state.exerciseIndex < safeLesson.exercises.length - 1 ? (
                <Pressable
                  onPress={advanceToNextExercise}
                  style={{ paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10, borderWidth: 1 }}
                >
                  <Text style={{ fontWeight: '700' }}>Next exercise</Text>
                </Pressable>
              ) : null}
            </View>
          </View>
        ) : (
          <View style={{ padding: 12, borderWidth: 1, borderRadius: 12 }}>
            <Text style={{ fontWeight: '700' }}>Status: {state.status}</Text>
            <Text style={{ opacity: 0.7, marginTop: 4 }}>
              Expected:{' '}
              {exercise.script[state.plyIndex]?.actor === 'user'
                ? exercise.script[state.plyIndex]?.uci
                : '(system)'}
            </Text>

            <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
              <Pressable
                onPress={restartExercise}
                style={{ paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10, borderWidth: 1 }}
              >
                <Text style={{ fontWeight: '700' }}>Restart exercise</Text>
              </Pressable>
            </View>
          </View>
        )}
      </View>
    </View>
  )
}
