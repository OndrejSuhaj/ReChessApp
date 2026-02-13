import type { Chess } from 'chess.js'
import React, { useMemo, useState } from 'react'
import { Pressable, Text, View } from 'react-native'

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const
const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'] as const

function squareColor(fileIndex: number, rankIndex: number) {
  // (0,0) = a8
  return (fileIndex + rankIndex) % 2 === 0 ? '#eee' : '#999'
}

export function ChessBoard({
  game,
  onUci,
  size = 72,
  lastUci = null,
  disabled = false,
}: {
  game: Chess
  onUci: (uci: string) => 'ok' | 'wrong' | 'illegal'
  size?: number
  lastUci?: string | null
  disabled?: boolean
}) {
  const [from, setFrom] = useState<string | null>(null)
  const [flashSquare, setFlashSquare] = useState<string | null>(null)
  

  const board = useMemo(() => {
    // chess.js: board() returns 8x8, ranks from 8 -> 1, files a -> h
    return game.board()
    
  }, [game.fen()])

  function handleSquarePress(square: string) {
    if (disabled) return
    if (!from) {
      setFrom(square)
      return
    }
    if (from === square) {
      setFrom(null)
      return
    }
    const uci = `${from}${square}`
    const result = onUci(uci)

    if (result !== 'ok') {
        // flash cílové pole červeně a reset výběru
        setFlashSquare(square)
        setTimeout(() => setFlashSquare(null), 220)
    }

    setFrom(null)
  }
  

  return (
    <View style={{ gap: 8 }}>
      <Text style={{ fontWeight: '600' }}>
        Tap from → to {from ? `(from: ${from})` : ''}
      </Text>

      <View style={{ borderWidth: 1, borderRadius: 12, overflow: 'hidden' }}>
        {board.map((rank, rankIndex) => (
          <View key={rankIndex} style={{ flexDirection: 'row' }}>
            {rank.map((piece, fileIndex) => {
                const file = FILES[fileIndex]
                const rankLabel = RANKS[rankIndex]
                const square = `${file}${rankLabel}`
                const isFlash = flashSquare === square

                const isSelected = from === square

                // lastUci = např. "e2e4" -> from="e2", to="e4"
                const lastFrom = lastUci ? lastUci.slice(0, 2) : null
                const lastTo = lastUci ? lastUci.slice(2, 4) : null
                // Hidden, for testing: const isLastFrom = lastFrom === square
                const isLastTo = lastTo === square

                // coordinate labels: rank číslo jen na file "a", file písmeno jen na rank "1"
                const showRank = fileIndex === 0
                const showFile = rankIndex === 7

                const bg = squareColor(fileIndex, rankIndex)

              // velmi jednoduché unicode figurky
              const symbol = piece
                ? piece.color === 'w'
                  ? ({
                      p: '♙',
                      n: '♘',
                      b: '♗',
                      r: '♖',
                      q: '♕',
                      k: '♔',
                    } as const)[piece.type]
                  : ({
                      p: '♟',
                      n: '♞',
                      b: '♝',
                      r: '♜',
                      q: '♛',
                      k: '♚',
                    } as const)[piece.type]
                : ''



              return (
                <Pressable
                  key={square}
                  onPress={() => handleSquarePress(square)}
                  style={{
                    width: size,
                    height: size,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: isFlash
                        ? '#ef4444'
                        : isSelected
                            ? '#fcd34d'
                            : isLastTo
                            ? '#a7f3d0'
                            : bg,
                    opacity: disabled ? 0.7 : 1,
                    }}
                    disabled={disabled}
                >
                    <View style={{ position: 'relative', width: size, height: size }}>
                        {showRank ? (
                            <Text
                            style={{
                                position: 'absolute',
                                top: 4,
                                left: 4,
                                fontSize: 10,
                                opacity: 0.8,
                            }}
                            >
                            {rankLabel}
                            </Text>
                        ) : null}

                        {showFile ? (
                            <Text
                            style={{
                                position: 'absolute',
                                bottom: 4,
                                right: 4,
                                fontSize: 10,
                                opacity: 0.8,
                            }}
                            >
                            {file}
                            </Text>
                        ) : null}

                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ fontSize: Math.round(size * 0.42) }}>{symbol}</Text>
                        </View>
                    </View>
                </Pressable>
              )
            })}
          </View>
        ))}
      </View>
    </View>
  )
}