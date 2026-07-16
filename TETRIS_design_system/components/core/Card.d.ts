import * as React from 'react';
/**
 * Props for the beveled surface panel with a hard drop shadow.
 * @startingPoint section="Core" subtitle="Content card with hover lift + accent bar" viewport="700x260"
 */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Accent color for hover border / top bar. */
  accent?: 'i' | 'o' | 't' | 's' | 'z' | 'j' | 'l';
  /** Lift + accent border on hover. */
  interactive?: boolean;
  /** Built-in padding. @default true */
  pad?: boolean;
  /** Render a colored bar across the top edge. */
  accentBar?: boolean;
  children?: React.ReactNode;
}
/**
 * Beveled surface panel with a hard drop shadow.
 */
export function Card(props: CardProps): JSX.Element;
