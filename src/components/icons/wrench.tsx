/** biome-ignore-all lint/a11y/noSvgWithoutTitle: No need for icon */
import { cn } from '@/lib/utils'
import type { defaultIconProps } from './types'

export const WrenchIcon = ({ className, ...props }: defaultIconProps) => {
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
        d="M14.453 2.896l-3.279 3.278.442 2.21 2.21.441 3.278-3.278h0a5.002 5.002 0 01-7.021 6.33h0L5.7 16.952a1.875 1.875 0 01-2.652-2.652l5.073-4.382h0a5.002 5.002 0 016.33-7.022h0z"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
