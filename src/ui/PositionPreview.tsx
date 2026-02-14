import { Chess } from 'chess.js'
import React, { useMemo } from 'react'
import { StyleSheet, View } from 'react-native'

import { PieceSvg } from './chessboard/PieceSvg'
import { boardTheme } from './chessboard/theme'
import type { PieceCode } from './pieces/alpha'

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const
const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'] as const

function isDarkSquare(fileIndex: number, rankIndex: number) {
  return (fileIndex + rankIndex) % 2 === 1
}

export function PositionPreview({
  fen,
  size = 160,
}: {
  fen: string
  size?: number
}) {
  const squareSize = Math.floor(size / 8)

  const board = useMemo(() => {
    try {
      const g = new Chess(fen)
      return g.board()
    } catch {
      const g = new Chess() // fallback start position
      return g.board()
    }
  }, [fen])

  return (
    <View style={[styles.frame, { width: squareSize * 8, height: squareSize * 8 }]}>
      {board.map((rank, rankIndex) => (
        <View key={rankIndex} style={styles.row}>
          {rank.map((piece, fileIndex) => {
            const bg = isDarkSquare(fileIndex, rankIndex)
              ? boardTheme.darkSquare
              : boardTheme.lightSquare

            const pieceCode: PieceCode | null = piece
              ? (`${piece.color}${piece.type.toUpperCase()}` as PieceCode)
              : null

            return (
              <View
                key={`${FILES[fileIndex]}${RANKS[rankIndex]}`}
                style={[styles.square, { width: squareSize, height: squareSize, backgroundColor: bg }]}
              >
                {pieceCode ? (
                  <PieceSvg code={pieceCode as any} size={Math.round(squareSize * 0.86)} />
                ) : null}
              </View>
            )
          })}
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  frame: {
    borderWidth: 1,
    borderColor: boardTheme.border,
    borderRadius: 14,
    overflow: 'hidden',
  },
  row: { flexDirection: 'row' },
  square: { alignItems: 'center', justifyContent: 'center' },
})
