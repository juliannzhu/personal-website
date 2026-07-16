import * as React from 'react';
export interface TabItem { value: string; label: React.ReactNode; }
export interface TabsProps {
  items: TabItem[];
  value: string;
  onChange?: (value: string) => void;
  piece?: 'i' | 'o' | 't' | 's' | 'z' | 'j' | 'l';
  className?: string;
}
/** Pixel-label tab strip; the active tab fills with the piece color. */
export function Tabs(props: TabsProps): JSX.Element;
