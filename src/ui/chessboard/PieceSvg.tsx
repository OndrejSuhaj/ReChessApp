import React from 'react';
import { View } from 'react-native';
import { ALPHA_PIECES, type PieceCode } from '../pieces/alpha';

// dev notes:
// - `code` je "wP", "bK"...
// - `size` je velikost čtverce; figurku škálujeme trochu dovnitř, aby měla padding
export function PieceSvg({ code, size }: { code: PieceCode; size: number }) {
  const Comp = ALPHA_PIECES[code]
  const piecePx = Math.max(10, Math.floor(size * 0.92)) // dev notes: figurka lehce menší než square

  return (
    <View style={{ width: piecePx, height: piecePx }}>
      <Comp width={piecePx} height={piecePx} />
    </View>
  )
}
