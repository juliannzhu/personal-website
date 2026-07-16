import * as React from 'react';
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Which tetromino color. @default 'i' */
  piece?: 'i' | 'o' | 't' | 's' | 'z' | 'j' | 'l';
  variant?: 'solid' | 'outline' | 'soft';
  /** Show a leading status dot. */
  dot?: boolean;
  children?: React.ReactNode;
}
/** Small uppercase mono status badge in a tetromino color. */
export function Badge(props: BadgeProps): JSX.Element;
