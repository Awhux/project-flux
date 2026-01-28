/** biome-ignore-all lint/a11y/noSvgWithoutTitle: No need for icon */
import { cn } from '@/lib/utils'
import type { defaultIconProps } from './types'

export const PlenusIcon = ({ className, ...props }: defaultIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={112}
      height={97}
      viewBox="0 0 112 97"
      fill="none"
      className={cn('fill-foreground', className)}
      {...props}
    >
      <path d="M99.537 0L112 21.512 99.537 43.024H74.61L62.147 21.512 74.61 0h24.927zM37.39 0l43.366 74.78-12.463 21.513H43.366L0 21.513 12.463 0H37.39z" />
    </svg>
  )
}
