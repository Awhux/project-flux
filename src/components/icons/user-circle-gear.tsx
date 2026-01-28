/** biome-ignore-all lint/a11y/noSvgWithoutTitle: No need for icon */
import { cn } from '@/lib/utils'

import type { defaultIconProps } from './types'

export const UserCircleGear = ({ className, ...props }: defaultIconProps) => {
  return (
    <svg
      className={cn('stroke-current', className)}
      xmlns="http://www.w3.org/2000/svg"
      width={20}
      height={20}
      viewBox="0 0 20 20"
      fill="none"
      {...props}
    >
      <path
        d="M10 12.5a3.125 3.125 0 100-6.25 3.125 3.125 0 000 6.25z"
        strokeWidth={1.5}
        strokeMiterlimit={10}
      />
      <path
        d="M4.984 15.576a5.627 5.627 0 0110.032 0M15.625 5.625a1.25 1.25 0 100-2.5 1.25 1.25 0 000 2.5zM15.625 3.125v-.938M14.542 3.75l-.812-.469M14.542 5l-.812.469M15.625 5.625v.938M16.707 5l.812.469M16.707 3.75l.812-.469M17.447 9.102a7.5 7.5 0 11-6.75-6.57"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
