import { cn } from '@/lib/utils'
import type { ComponentProps } from 'react'

export type Props = ComponentProps<'div'> & {
  children: React.ReactNode
}

export const Section = ({ children, className, ...props }: Props) => {
  return (
    <div className={cn('flex h-full w-full flex-col', className)} {...props}>
      <div className="flex w-full h-full flex-col overflow-y-auto overflow-x-hidden">
        {children}
      </div>
    </div>
  )
}
