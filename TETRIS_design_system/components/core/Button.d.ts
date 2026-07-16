import * as React from 'react';

/**
 * Props for the beveled tetromino-block button that locks down on press.
 * @startingPoint section="Core" subtitle="Primary action button with 7 variants" viewport="700x200"
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style. `primary` = cyan I-piece. */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'warning' | 'magic';
  /** Size scale. @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** Stretch to full container width. */
  block?: boolean;
  disabled?: boolean;
  /** Icon node placed before the label. */
  leftIcon?: React.ReactNode;
  /** Icon node placed after the label. */
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
}

/**
 * Beveled tetromino-block button that locks down on press.
 */
export function Button(props: ButtonProps): JSX.Element;
