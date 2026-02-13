// src/ui/chessboard/theme.ts

//dev notes: držíme theme separátně, ať můžeme později snadno měnit skins
export const boardTheme = {
  // Chess.com-ish classic
  lightSquare: '#f0d9b5',
  darkSquare: '#b58863',

  // Overlay vrstvy (jemné, ne křiklavé)
  selected: 'rgba(255, 255, 0, 0.35)',
  lastMove: 'rgba(255, 215, 0, 0.28)',
  wrongFlash: 'rgba(239, 68, 68, 0.75)',

  // Coordinates
  coordOnLight: 'rgba(0,0,0,0.35)',
  coordOnDark: 'rgba(255,255,255,0.55)',

  // Board container
  border: 'rgba(0,0,0,0.18)',
}