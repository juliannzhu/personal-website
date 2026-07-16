import * as React from 'react';
export interface TetrominoProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Which of the 7 pieces. @default 't' */
  piece?: 'i' | 'o' | 't' | 's' | 'z' | 'j' | 'l';
  /** Block size in px. @default 24 */
  size?: number;
  /** Gentle floating animation. */
  bob?: boolean;
}
/** Decorative beveled tetromino piece rendered from divs. */
export function Tetromino(props: TetrominoProps): JSX.Element;
