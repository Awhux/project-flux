/** biome-ignore-all lint/a11y/noSvgWithoutTitle: No need for icon */
import { cn } from '@/lib/utils'
import type { defaultIconProps } from './types'

export const CreditCardIcon = ({ className, ...props }: defaultIconProps) => {
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
        d="M17.5 4.375h-15A.625.625 0 001.875 5v10c0 .345.28.625.625.625h15c.345 0 .625-.28.625-.625V5a.625.625 0 00-.625-.625zM13.124 13.125h2.5M9.375 13.125h1.25M1.875 7.566h16.25"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
