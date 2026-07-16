import * as React from 'react';
export interface SwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean, e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  label?: string;
  className?: string;
}
/** Toggle styled as a sliding block; lights up green when on. */
export function Switch(props: SwitchProps): JSX.Element;
