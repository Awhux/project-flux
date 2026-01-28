/** biome-ignore-all lint/a11y/noSvgWithoutTitle: No need for icon */
import { cn } from '@/lib/utils'
import type { defaultIconProps } from './types'

export const BellIcon = ({ className, ...props }: defaultIconProps) => {
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
        d="M4.391 8.125A5.617 5.617 0 0110.043 2.5c3.093.023 5.567 2.594 5.567 5.696v.554c0 2.798.585 4.422 1.1 5.31a.624.624 0 01-.537.94H3.827a.625.625 0 01-.538-.941c.516-.887 1.102-2.511 1.102-5.309v-.625zM7.5 15v.625a2.5 2.5 0 005 0V15"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export const BellRingingIcon = ({ className, ...props }: defaultIconProps) => {
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
        d="M4.391 8.75a5.61 5.61 0 1111.219 0v0c0 2.798.585 4.422 1.1 5.31a.624.624 0 01-.537.94H3.827a.624.624 0 01-.538-.94c.516-.888 1.102-2.512 1.102-5.31h0zM7.5 15v.625a2.5 2.5 0 005 0V15M14.33 1.874a8.161 8.161 0 012.963 3.29M2.707 5.164a8.161 8.161 0 012.962-3.29"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
