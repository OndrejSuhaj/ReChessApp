import type { Chess } from 'chess.js'
import React, { useEffect, useMemo, useState } from 'react'
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native'
import { PieceSvg } from './chessboard/PieceSvg'
import { boardTheme } from './chessboard/theme'
import type { PieceCode } from './pieces/alpha'

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const
const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'] as const

function isDarkSquare(fileIndex: number, rankIndex: number) {
  // (0,0) = a8 is light on standard boards
  return (fileIndex + rankIndex) % 2 === 1
}

function squareBaseColor(fileIndex: number, rankIndex: number) {
  return isDarkSquare(fileIndex, rankIndex) ? boardTheme.darkSquare : boardTheme.lightSquare
}

// dev notes: pomocné mapy jen pro TS inference v pieceToUnicode
const whiteMap = { p: '♙', n: '♘', b: '♗', r: '♖', q: '♕', k: '♔' } as const
const blackMap = { p: '♟', n: '♞', b: '♝', r: '♜', q: '♛', k: '♚' } as const

export function ChessBoard({
  game,
  onUci,
  maxBoardWidth = 640,
  padding = 0,
  lastUci = null,
  disabled = false,
  showCoordinates = true,
}: {
  game: Chess
  onUci: (uci: string) => 'ok' | 'wrong' | 'illegal'
  // dev notes: cap pro web – ať board není přerostlý
  maxBoardWidth?: number
  // dev notes: vnitřní odsazení wrapperu kolem boardu
  padding?: number
  // dev notes: pro zvýraznění posledního tahu (from+to)
  lastUci?: string | null
  disabled?: boolean
  showCoordinates?: boolean
}) {
  const { width: windowWidth } = useWindowDimensions()

  const [from, setFrom] = useState<string | null>(null)
  const [flashSquare, setFlashSquare] = useState<string | null>(null)

  // dev notes: Na RN Web se může při loadu krátce změnit šířka/layout → board by "poskočil".
  // Proto lockneme boardPx po prvním stabilním výpočtu a měníme ho až při výraznější změně.
  const [lockedBoardPx, setLockedBoardPx] = useState<number | null>(null)

  const safetyMargin = 24 // dev notes: rezerva pro layout/padding/taby (hlavně na webu)
  const availableWidth = Math.max(0, windowWidth - padding * 2 - safetyMargin)
  const boardTarget = Math.min(availableWidth, maxBoardWidth)

  // dev notes: minSquareSize – na mobilu/menším okně chceme umět jít níž
  const minSquareSize = 14
  const desiredSquareSize = Math.max(minSquareSize, Math.floor(boardTarget / 8))
  const desiredBoardPx = desiredSquareSize * 8

  useEffect(() => {
  // dev notes: první lock jakmile máme rozumnou velikost
  if (lockedBoardPx == null && desiredBoardPx >= 96) {
    setLockedBoardPx(desiredBoardPx)
    return
  }

  // dev notes: pokud už lock máme, měň jen při výrazné změně (resize)
  if (lockedBoardPx != null && Math.abs(desiredBoardPx - lockedBoardPx) >= 16) {
    setLockedBoardPx(desiredBoardPx)
  }
}, [desiredBoardPx, lockedBoardPx])

  const boardPx = lockedBoardPx ?? desiredBoardPx
  const squareSize = Math.floor(boardPx / 8)

  const board = useMemo(() => {
    // dev notes: board() je 8x8, ranks 8→1, files a→h
    return game.board()
  }, [game.fen()])

  function handleSquarePress(square: string) {
    if (disabled) return

    // 1) první klik = vybrat FROM
    if (!from) {
      setFrom(square)
      return
    }

    // 2) klik na stejný square = zrušit výběr
    if (from === square) {
      setFrom(null)
      return
    }

    // 3) druhý klik = TO → UCI
    const uci = `${from}${square}`
    const result = onUci(uci)

    // dev notes: krátký flash cílového pole při wrong/illegal
    if (result !== 'ok') {
      setFlashSquare(square)
      setTimeout(() => setFlashSquare(null), 220)
    }

    setFrom(null)
  }

  const lastFrom = lastUci ? lastUci.slice(0, 2) : null
  const lastTo = lastUci ? lastUci.slice(2, 4) : null

  // dev notes: pokud je width extrémně malá (nebo na prvním renderu), radši nevykresluj board
  const isReady = boardPx >= 96

  return (
    <View style={{ gap: 10 }}>
      <Text style={styles.header}>
        Tap from → to {from ? `(from: ${from})` : ''}
      </Text>

      {!isReady ? (
        // dev notes: placeholder brání layout shift při úplně prvním renderu
        <View style={{ height: 320 }} />
      ) : (
        <View style={{ padding, width: '100%', alignSelf: 'stretch' }}>
          <View
            style={[
              styles.boardFrame,
              {
                borderColor: boardTheme.border,
                width: boardPx,
                height: boardPx,
                alignSelf: 'flex-start',
              },
            ]}
          >
            {board.map((rank, rankIndex) => (
              <View key={rankIndex} style={styles.row}>
                {rank.map((piece, fileIndex) => {
                  const file = FILES[fileIndex]
                  const rankLabel = RANKS[rankIndex]
                  const square = `${file}${rankLabel}`

                  const dark = isDarkSquare(fileIndex, rankIndex)
                  const bg = squareBaseColor(fileIndex, rankIndex)

                  const isSelected = from === square
                  const isLastFrom = lastFrom === square
                  const isLastTo = lastTo === square
                  const isFlash = flashSquare === square

                  // dev notes: coordinate labels – jen a-file ukazuje rank, jen 1-rank ukazuje file
                  const showRank = showCoordinates && fileIndex === 0
                  const showFile = showCoordinates && rankIndex === 7
                  const coordColor = dark ? boardTheme.coordOnDark : boardTheme.coordOnLight

                  const pieceCode: PieceCode | null = piece
                    ? (`${piece.color}${piece.type.toUpperCase()}` as PieceCode)
                    : null// pieceCode bude např. "wP", "bK"

                  return (
                    <Pressable
                      key={square}
                      onPress={() => handleSquarePress(square)}
                      disabled={disabled}
                      style={[
                        styles.square,
                        {
                          width: squareSize,
                          height: squareSize,
                          backgroundColor: bg,
                          opacity: disabled ? 0.72 : 1,
                        },
                      ]}
                    >
                      {/* Overlay layer (highlights) */}
                      <View style={StyleSheet.absoluteFill} pointerEvents="none">
                        {isLastFrom || isLastTo ? (
                          <View
                            style={[
                              StyleSheet.absoluteFill,
                              { backgroundColor: boardTheme.lastMove },
                            ]}
                          />
                        ) : null}

                        {isSelected ? (
                          <View
                            style={[
                              StyleSheet.absoluteFill,
                              {
                                borderWidth: 3,
                                borderColor: boardTheme.selected,
                                
                                },
                            ]}
                          />
                        ) : null}

                        {isFlash ? (
                          <View
                            style={[
                              StyleSheet.absoluteFill,
                              { backgroundColor: boardTheme.wrongFlash },
                            ]}
                          />
                        ) : null}
                      </View>

                      {/* Coordinates */}
                      {showRank ? (
                        <Text
                          style={[
                            styles.coord,
                            {
                              color: coordColor,
                              top: 4,
                              left: 6,
                              fontSize: Math.max(9, Math.round(squareSize * 0.14)),
                            },
                          ]}
                        >
                          {rankLabel}
                        </Text>
                      ) : null}

                      {showFile ? (
                        <Text
                          style={[
                            styles.coord,
                            {
                              color: coordColor,
                              bottom: 4,
                              right: 6,
                              fontSize: Math.max(9, Math.round(squareSize * 0.14)),
                            },
                          ]}
                        >
                          {file}
                        </Text>
                      ) : null}

                      {/* Piece layer (temporary unicode; next step will be SVG) */}
                      <View style={styles.pieceCenter} pointerEvents="none">
                        {pieceCode ? <PieceSvg
                                code={pieceCode as any}
                                size={Math.round(squareSize * 0.88)}
                                /> : null}
                      </View>
                    </Pressable>
                  )
                })}
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    fontWeight: '700',
    fontSize: 14,
    opacity: 0.9,
  },
  boardFrame: {
    borderWidth: 1,
    borderRadius: 14,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
  },
  square: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  coord: {
    position: 'absolute',
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  pieceCenter: {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',

  // jemný stín pro web
  shadowColor: '#000',
  shadowOpacity: 0.15,
  shadowRadius: 2,
  },
})
