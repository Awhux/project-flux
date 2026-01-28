import type { NextFontWithVariable } from 'next/dist/compiled/@next/font'
import { inter } from './resources/inter'
import { mono } from './resources/mono'
import { geist, geistMono } from './resources/geist'
import { figtree } from './resources/figtree'

type FontListConfigurationItem = [
  NextFontWithVariable,
  'sans-serif' | 'serif' | 'monospace' | 'system-ui' | 'emoji' | 'cursive',
]
type FontListConfiguration = FontListConfigurationItem[]

const fontList = [
  // [inter, 'sans-serif'],
  // [mono, 'monospace'],
  [geist, 'sans-serif'],
  [geistMono, 'monospace'],
  [figtree, 'sans-serif'],
] as FontListConfiguration

export function createFontClassList(): string {
  return fontList.map(([font]) => font.variable).join(' ')
}

export function createTailwindFontList(): Record<string, [string, string]> {
  return fontList.reduce(
    (acc, [font, type]) => {
      acc[font.variable] = [`var(--font-${font.variable})`, type]
      return acc
    },
    {} as Record<string, [string, string]>,
  )
}
