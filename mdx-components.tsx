import type { MDXComponents } from 'mdx/types'
import { cn } from '@/lib/utils'

const components: MDXComponents = {
  h1: ({ className, ...props }) => (
    <h1
      className={cn(
        'text-4xl font-semibold tracking-tight text-foreground mt-12 mb-6 first:mt-0',
        className,
      )}
      {...props}
    />
  ),
  h2: ({ className, ...props }) => (
    <h2
      className={cn(
        'text-3xl font-semibold tracking-tight text-foreground mt-10 mb-4 first:mt-0',
        className,
      )}
      {...props}
    />
  ),
  h3: ({ className, ...props }) => (
    <h3
      className={cn(
        'text-2xl font-semibold tracking-tight text-foreground mt-8 mb-3',
        className,
      )}
      {...props}
    />
  ),
  h4: ({ className, ...props }) => (
    <h4
      className={cn(
        'text-xl font-semibold tracking-tight text-foreground mt-6 mb-2',
        className,
      )}
      {...props}
    />
  ),
  h5: ({ className, ...props }) => (
    <h5
      className={cn(
        'text-lg font-semibold tracking-tight text-foreground mt-4 mb-2',
        className,
      )}
      {...props}
    />
  ),
  h6: ({ className, ...props }) => (
    <h6
      className={cn(
        'text-base font-semibold tracking-tight text-foreground mt-4 mb-2',
        className,
      )}
      {...props}
    />
  ),
  p: ({ className, ...props }) => (
    <p
      className={cn(
        'text-base leading-7 text-foreground/90 mb-4 last:mb-0',
        className,
      )}
      {...props}
    />
  ),
  ul: ({ className, ...props }) => (
    <ul
      className={cn(
        'list-none space-y-2 mb-4 pl-0 [&>li]:pl-6 [&>li]:relative [&>li]:before:absolute [&>li]:before:left-0 [&>li]:before:content-["•"] [&>li]:before:text-primary [&>li]:before:text-xl [&>li]:before:leading-7',
        className,
      )}
      {...props}
    />
  ),
  ol: ({ className, ...props }) => (
    <ol
      className={cn(
        'list-decimal space-y-2 mb-4 pl-6 marker:text-muted-foreground',
        className,
      )}
      {...props}
    />
  ),
  li: ({ className, ...props }) => (
    <li
      className={cn(
        'text-base leading-7 text-foreground/90',
        className,
      )}
      {...props}
    />
  ),
  a: ({ className, ...props }) => (
    <a
      className={cn(
        'text-primary underline-offset-4 hover:underline transition-colors font-medium',
        className,
      )}
      {...props}
    />
  ),
  strong: ({ className, ...props }) => (
    <strong
      className={cn('font-semibold text-foreground', className)}
      {...props}
    />
  ),
  hr: ({ className, ...props }) => (
    <hr
      className={cn(
        'my-8 border-0 border-t border-border',
        className,
      )}
      {...props}
    />
  ),
  blockquote: ({ className, ...props }) => (
    <blockquote
      className={cn(
        'border-l-4 border-primary pl-4 italic text-muted-foreground my-4',
        className,
      )}
      {...props}
    />
  ),
}

export function useMDXComponents(): MDXComponents {
  return components
}
