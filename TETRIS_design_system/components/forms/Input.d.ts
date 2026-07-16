import * as React from 'react';
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  /** Error message — turns the field red and replaces the hint. */
  error?: string;
}
/** Single-line text field with label, hint, and error states. */
export function Input(props: InputProps): JSX.Element;
