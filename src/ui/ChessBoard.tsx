
import type { Chess } from 'chess.js'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
    PanResponder,
    Pressable,
    StyleSheet,
    Text,
    useWindowDimensions,
    View,
} from 'react-native'
import { PieceSvg } from './chessboard/PieceSvg'
import { boardTheme } from './chessboard/theme'
import type { PieceCode } from './pieces/alpha'

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const
const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'] as const

function isDarkSquare(fileIndex: number, rankIndex: number) {
  return (fileIndex + rankIndex) % 2 === 1
}
function squareBaseColor(fileIndex: number, rankIndex: number) {
  return isDarkSquare(fileIndex, rankIndex) ? boardTheme.darkSquare : boardTheme.lightSquare
}

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
  maxBoardWidth?: number
  padding?: number
  lastUci?: string | null
  disabled?: boolean
  showCoordinates?: boolean
}) {
  const { width: windowWidth } = useWindowDimensions()

  const [from, setFrom] = useState<string | null>(null)
  const [flashSquare, setFlashSquare] = useState<string | null>(null)
  const [hoverSquare, setHoverSquare] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const [dragPiece, setDragPiece] = useState<PieceCode | null>(null)
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null) 

  const [lockedBoardPx, setLockedBoardPx] = useState<number | null>(null)

  const boardRef = useRef<View | null>(null)
  const boardOrigin = useRef<{ x: number; y: number }>({ x: 0, y: 0 })

  const safetyMargin = 24
  const availableWidth = Math.max(0, windowWidth - padding * 2 - safetyMargin)
  const boardTarget = Math.min(availableWidth, maxBoardWidth)

  const minSquareSize = 14
  const desiredSquareSize = Math.max(minSquareSize, Math.floor(boardTarget / 8))
  const desiredBoardPx = desiredSquareSize * 8

  useEffect(() => {
    if (lockedBoardPx == null && desiredBoardPx >= 96) {
      setLockedBoardPx(desiredBoardPx)
      return
    }
    if (lockedBoardPx != null && Math.abs(desiredBoardPx - lockedBoardPx) >= 16) {
      setLockedBoardPx(desiredBoardPx)
    }
  }, [desiredBoardPx, lockedBoardPx])

  const boardPx = lockedBoardPx ?? desiredBoardPx
  const squareSize = Math.floor(boardPx / 8)

  const board = useMemo(() => game.board(), [game.fen()])

  const lastFrom = lastUci ? lastUci.slice(0, 2) : null
  const lastTo = lastUci ? lastUci.slice(2, 4) : null
  const isReady = boardPx >= 96

  function pointToSquare(pageX: number, pageY: number): string | null {
    const x = pageX - boardOrigin.current.x
    const y = pageY - boardOrigin.current.y
    if (x < 0 || y < 0 || x >= boardPx || y >= boardPx) return null

    const fileIndex = Math.floor(x / squareSize)
    const rankIndex = Math.floor(y / squareSize)
    if (fileIndex < 0 || fileIndex > 7 || rankIndex < 0 || rankIndex > 7) return null

    return `${FILES[fileIndex]}${RANKS[rankIndex]}`
  }

  function commitMove(fromSq: string, toSq: string) {
    const uci = `${fromSq}${toSq}`
    const result = onUci(uci)

    if (result !== 'ok') {
      setFlashSquare(toSq)
      setTimeout(() => setFlashSquare(null), 220)
    }
  }

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

    commitMove(from, square)
    setFrom(null)
  }

  function getPieceCodeAt(square: string): PieceCode | null {
    const p = game.get(square as any) // chess.js: { type, color } | null
    if (!p) return null
    return `${p.color}${p.type.toUpperCase()}` as PieceCode
 }

    // pokud chceš omezit jen na "figura na tahu":
  function isPieceMovableBySideToMove(square: string): boolean {
    const p = game.get(square as any)
    if (!p) return false
    // game.turn() je 'w' | 'b'
    return p.color === game.turn()
  }

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => !disabled,
        onStartShouldSetPanResponderCapture: () => !disabled,
        onMoveShouldSetPanResponder: () => !disabled,
        onPanResponderGrant: (evt) => {
          if (disabled) return
          const { pageX, pageY } = evt.nativeEvent
          const sq = pointToSquare(pageX, pageY)
          if (!sq) return

          // varianta: jen figura na tahu
          if (!isPieceMovableBySideToMove(sq)) return
          
          const piece = getPieceCodeAt(sq)
          if (!piece) return

          setDragPiece(piece)
          setDragging(true)
          setDragPos({ x: pageX, y: pageY })

            setFrom(sq)
            setHoverSquare(null)
        },
        onPanResponderMove: (evt) => {
          if (disabled) return
          if (!from) return
          const { pageX, pageY } = evt.nativeEvent
          const sq = pointToSquare(pageX, pageY)
          setHoverSquare(sq)
          setDragPos({ x: pageX, y: pageY })
        },
        onPanResponderRelease: () => {
            if (disabled) return
            if (from && hoverSquare && from !== hoverSquare) {
                commitMove(from, hoverSquare)
            }
            setFrom(null)
            setHoverSquare(null)

            setDragging(false)
            setDragPiece(null)
            setDragPos(null)
            },
            onPanResponderTerminate: () => {
            setFrom(null)
            setHoverSquare(null)

            setDragging(false)
            setDragPiece(null)
            setDragPos(null)
            },
      }),
    [disabled, from, hoverSquare, boardPx, squareSize]
  )

  function updateBoardOrigin() {
    const node: any = boardRef.current
    if (!node?.measureInWindow) return
    node.measureInWindow((x: number, y: number) => {
      boardOrigin.current = { x, y }
    })
  }

  return (
    <View style={{ gap: 10 }}>
      <Text style={styles.header}>
        Tap or drag from → to {from ? `(from: ${from})` : ''}
      </Text>

      {!isReady ? (
        <View style={{ height: 320 }} />
      ) : (
        <View style={{ padding, width: '100%', alignSelf: 'stretch' }}>
          <View
            ref={boardRef}
            onLayout={() => {
              requestAnimationFrame(updateBoardOrigin)
            }}
            {...panResponder.panHandlers}
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
                  const isHover = hoverSquare === square
                  const isLastFrom = lastFrom === square
                  const isLastTo = lastTo === square
                  const isFlash = flashSquare === square

                  const showRank = showCoordinates && fileIndex === 0
                  const showFile = showCoordinates && rankIndex === 7
                  const coordColor = dark ? boardTheme.coordOnDark : boardTheme.coordOnLight

                  let pieceCode: PieceCode | null = piece
                    ? (`${piece.color}${piece.type.toUpperCase()}` as PieceCode)
                    : null

                    // během dragu schovej původní figuru na start square
                    if (dragging && from === square) {
                        pieceCode = null
                    }

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
                      <View style={StyleSheet.absoluteFill} pointerEvents="none">
                        {isLastFrom || isLastTo ? (
                          <View style={[StyleSheet.absoluteFill, { backgroundColor: boardTheme.lastMove }]} />
                        ) : null}

                        {isSelected ? (
                          <View
                            style={[
                              StyleSheet.absoluteFill,
                              { borderWidth: 3, borderColor: boardTheme.selected },
                            ]}
                          />
                        ) : null}

                        {isHover && !isSelected ? (
                          <View
                            style={[
                              StyleSheet.absoluteFill,
                              { borderWidth: 2, borderColor: boardTheme.selected, opacity: 0.5 },
                            ]}
                          />
                        ) : null}

                        {isFlash ? (
                          <View style={[StyleSheet.absoluteFill, { backgroundColor: boardTheme.wrongFlash }]} />
                        ) : null}
                      </View>

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

                      <View style={styles.pieceCenter} pointerEvents="none">
                        {pieceCode ? (
                          <PieceSvg code={pieceCode as any} size={Math.round(squareSize * 0.88)} />
                        ) : null}
                      </View>
                    </Pressable>
                  )
                })}
              </View>
              
            ))}
            {dragging && dragPiece && dragPos ? (
                <View
                pointerEvents="none"
                style={[
                    styles.ghost,
                    {
                    left: dragPos.x - boardOrigin.current.x - squareSize * 0.44,
                    top: dragPos.y - boardOrigin.current.y - squareSize * 0.44,
                    width: squareSize,
                    height: squareSize,
                    },
                ]}
                >
                <PieceSvg
                    code={dragPiece as any}
                    size={Math.round(squareSize * 0.92)}
                />
                </View>
            ) : null}

            </View>


          </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  header: { fontWeight: '700', fontSize: 14, opacity: 0.9 },
  boardFrame: { borderWidth: 1, borderRadius: 14, overflow: 'hidden' },
  row: { flexDirection: 'row' },
  square: { alignItems: 'center', justifyContent: 'center' },
  coord: { position: 'absolute', fontWeight: '700', letterSpacing: 0.2 },
  pieceCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  ghost: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.95,
    },
})