import * as React from 'react';
export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  src?: string;
  alt?: string;
  /** Fallback initials when no src (max 2 chars). */
  initials?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | number;
  /** Background color when showing initials. */
  piece?: 'i' | 'o' | 't' | 's' | 'z' | 'j' | 'l';
  round?: boolean;
}
/** Square (or round) block avatar; image or pixel-font initials. */
export function Avatar(props: AvatarProps): JSX.Element;
