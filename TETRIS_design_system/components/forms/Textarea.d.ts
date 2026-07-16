import * as React from 'react';
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
}
/** Multi-line text field matching Input styling. */
export function Textarea(props: TextareaProps): JSX.Element;
