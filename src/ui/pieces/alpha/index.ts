// src/ui/chessboard/pieces/alpha/index.ts
// dev notes: jednotné mapování kódů na komponenty

import wB from './wB.svg'
import wK from './wK.svg'
import wN from './wN.svg'
import wP from './wP.svg'
import wQ from './wQ.svg'
import wR from './wR.svg'

import bB from './bB.svg'
import bK from './bK.svg'
import bN from './bN.svg'
import bP from './bP.svg'
import bQ from './bQ.svg'
import bR from './bR.svg'

export const ALPHA_PIECES = {
  wP,
  wN,
  wB,
  wR,
  wQ,
  wK,
  bP,
  bN,
  bB,
  bR,
  bQ,
  bK,
} as const

export type PieceCode = keyof typeof ALPHA_PIECES
