/** biome-ignore-all lint/a11y/noSvgWithoutTitle: No need for icon */
import { cn } from '@/lib/utils'
import type { defaultIconProps } from './types'

export const GlobeIcon = ({ className, ...props }: defaultIconProps) => {
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
        d="M10 17.5a7.5 7.5 0 100-15 7.5 7.5 0 000 15z"
        strokeWidth={1.5}
        strokeMiterlimit={10}
      />
      <path
        d="M2.927 7.5h14.146M2.927 12.5h14.146"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 17.299c1.726 0 3.125-3.268 3.125-7.3 0-4.03-1.4-7.298-3.125-7.298-1.726 0-3.125 3.268-3.125 7.299 0 4.03 1.4 7.299 3.125 7.299z"
        strokeWidth={1.5}
        strokeMiterlimit={10}
      />
    </svg>
  )
}
