import { Chess } from 'chess.js'
import React, { useMemo, useState } from 'react'
import { Pressable, Text, View } from 'react-native'

import { getLessonById } from '../../src/domain/exercises'
import type { RunnerState } from '../../src/domain/types'
import { ChessBoard } from '../../src/ui/ChessBoard'

export default function HomeScreen() {

  const [state, setState] = useState<RunnerState>({
    exerciseIndex: 0,
    plyIndex: 0,
    status: 'ready',
  })

  const lesson = getLessonById('lesson-vienna-gambit') //-switch to Viesna Gambit for testing
  
  if (!lesson || lesson.exercises.length === 0) {
    return (
      <View style={{ padding: 24 }}>
        <Text>Lesson not found.</Text>
      </View>
    )
  }

  const exercise = lesson.exercises[state.exerciseIndex]

  if (!exercise) {
    return (
      <View style={{ padding: 24 }}>
        <Text>Exercise index out of range.</Text>
      </View>
    )
  }

  const game = useMemo(
    () => new Chess(exercise.fen), 
    [exercise.fen, state.exerciseIndex])

  const expected = exercise.script[state.plyIndex]

  const isDone = state.plyIndex >= exercise.script.length
  const hasNext = state.exerciseIndex < lesson.exercises.length - 1

  const totalExercises = lesson.exercises.length
  const lessonProgress = (state.exerciseIndex + 1) / totalExercises
  const exerciseLen = exercise.script.length
  const exerciseProgress = Math.min(state.plyIndex, exerciseLen) / exerciseLen

  const [lastUci, setLastUci] = useState<string | null>(null)

  function resetExercise() {
    setLastUci(null)
    setState((prev) => ({
      exerciseIndex: Math.min(prev.exerciseIndex + 1, totalExercises - 1),
      plyIndex: 0,
      status: 'ready',
    }))
}

function nextExercise() {
  setLastUci(null)
  setState((prev) => ({
    exerciseIndex: Math.min(prev.exerciseIndex + 1, totalExercises - 1),
    plyIndex: 0,
    status: 'ready',
    lastUci: null
  }))
}

  function setStatus(s: string) {
    setState((prev) => ({ ...prev, status: s }))
  }

function playUserUci(uci: string): 'ok' | 'wrong' | 'illegal' {
  if (isDone) return 'wrong'

  if (!expected || expected.actor !== 'user') {
    setStatus('Not expecting user move now.')
    return 'wrong'
  }

  if (expected.uci !== uci) {
    setStatus(`Wrong. Expected: ${expected.uci}, got: ${uci}`)
    return  'wrong'
  }

  const res = game.move({
    from: uci.slice(0, 2),
    to: uci.slice(2, 4),
    promotion: 'q',
  })

  if (!res) {
    setStatus(`Illegal move: ${uci}`)
    return 'illegal'
  }

  setLastUci(uci)

  let nextIndex = state.plyIndex + 1

  // přehraj systémové tahy
  while (
    nextIndex < exercise.script.length &&
    exercise.script[nextIndex].actor === 'system'
  ) {
    const sysUci = exercise.script[nextIndex].uci

    game.move({
      from: sysUci.slice(0, 2),
      to: sysUci.slice(2, 4),
      promotion: 'q',
    })

    nextIndex++
  }

  if (nextIndex >= exercise.script.length) {
    setState((prev) => ({
      ...prev,
      plyIndex: nextIndex,
      status: exercise.successMessage,
    }))
    return 'ok'
  }

  setState((prev) => ({
    ...prev,
    plyIndex: nextIndex,
    status: 'ok',
  }))
  return 'ok'
}

  return (
    <View style={{ flex: 1, padding: 24, gap: 16 }}>
  {/* Lesson progress bar */}
  <View style={{ gap: 8 }}>
    <Text style={{ color: '#6b7280' }}>
      Lesson progress: {state.exerciseIndex + 1}/{totalExercises}
    </Text>
    <View style={{ height: 10, borderRadius: 999, backgroundColor: '#e5e7eb' }}>
      <View style={{ height: 10, borderRadius: 999, width: `${lessonProgress * 100}%`, backgroundColor: '#facc15' }} />
    </View>
  </View>

  {/* Main content */}
  <View style={{ flex: 1, flexDirection: 'row', gap: 24, alignItems: 'flex-start' }}>
    {/* LEFT: Board */}
    <View style={{ gap: 12 }}>
      <Text style={{ fontSize: 26, fontWeight: '800' }}>{lesson.title}</Text>
      {lesson.description ? <Text style={{ maxWidth: 720, color: '#6b7280' }}>{lesson.description}</Text> : null}

      <ChessBoard
        game={game}
        onUci={playUserUci}
        size={72}
        lastUci={lastUci}
        disabled={isDone}
      />

      {/* Exercise progress */}
      <View style={{ gap: 8 }}>
        <Text style={{ color: '#6b7280' }}>
          Exercise progress: {Math.min(state.plyIndex, exerciseLen)}/{exerciseLen}
        </Text>
        <View style={{ height: 10, borderRadius: 999, backgroundColor: '#e5e7eb' }}>
          <View style={{ height: 10, borderRadius: 999, width: `${exerciseProgress * 100}%`, backgroundColor: '#111827' }} />
        </View>
      </View>
    </View>

    {/* RIGHT: Sidebar */}
    <View
      style={{
        width: 360,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 16,
        padding: 16,
        gap: 12,
        backgroundColor: '#111827',
      }}
    >
      <View style={{ gap: 4 }}>
        <Text style={{ color: 'white', fontSize: 16, fontWeight: '700' }}>
          Practice · {lesson.title}
        </Text>
        <Text style={{ color: '#9ca3af' }}>
          {exercise.label} · #{state.exerciseIndex + 1}
        </Text>
      </View>

      {/* Status bubble */}
      <View style={{ backgroundColor: 'white', borderRadius: 12, padding: 12 }}>
        <Text style={{ fontWeight: '600' }}>
          {state.status.startsWith('Wrong') || state.status.startsWith('Illegal')
            ? '❌ ' + state.status
            : isDone
              ? '✅ ' + state.status
              : state.status}
        </Text>
      </View>

      {/* Primary Next (replaces "Learn") */}
      <Pressable
        onPress={isDone && hasNext ? nextExercise : undefined}
        style={{
          paddingVertical: 14,
          borderRadius: 12,
          alignItems: 'center',
          backgroundColor: isDone && hasNext ? '#facc15' : '#374151',
          opacity: isDone && hasNext ? 1 : 0.6,
        }}
      >
        <Text style={{ fontWeight: '800' }}>
          {isDone && hasNext ? 'Next →' : isDone && !hasNext ? 'Done' : 'Next (finish exercise)'}
        </Text>
      </Pressable>

      {/* Secondary */}
      <Pressable
        onPress={() => {
          setLastUci(null)
          resetExercise()
        }}
        style={{
          paddingVertical: 12,
          borderRadius: 12,
          alignItems: 'center',
          backgroundColor: '#1f2937',
          borderWidth: 1,
          borderColor: '#374151',
        }}
      >
        <Text style={{ color: 'white', fontWeight: '700' }}>Reset</Text>
      </Pressable>
    </View>
  </View>
</View>
  )
}