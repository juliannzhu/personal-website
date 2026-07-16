import * as React from 'react';
export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  piece?: 'i' | 'o' | 't' | 's' | 'z' | 'j' | 'l';
  /** Adds hover affordance (use for filters). */
  interactive?: boolean;
  active?: boolean;
  children?: React.ReactNode;
}
/** Keyword / skill chip with a colored block marker. */
export function Tag(props: TagProps): JSX.Element;
