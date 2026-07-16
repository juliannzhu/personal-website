import * as React from 'react';
export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'accent' | 'ghost';
  /** Accessible label (required — the button has no visible text). */
  label?: string;
  children?: React.ReactNode;
}
/** Square block button holding a single icon. */
export function IconButton(props: IconButtonProps): JSX.Element;
