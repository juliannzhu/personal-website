import * as React from 'react';
export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 0–100. */
  value?: number;
  /** Number of block segments. @default 10 */
  cells?: number;
  piece?: 'i' | 'o' | 't' | 's' | 'z' | 'j' | 'l';
  label?: string;
  showValue?: boolean;
  cellHeight?: number;
}
/** Segmented "stacked block" progress / skill meter. */
export function ProgressBar(props: ProgressBarProps): JSX.Element;
