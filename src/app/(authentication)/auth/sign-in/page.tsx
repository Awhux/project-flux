import type { Metadata } from 'next'
import SignInScreen from '@/features/authentication/components/sign-in/sign-in-screen'

export const metadata: Metadata = {
  title: 'Entre em sua conta',
  description: 'Entre em sua conta para continuar',
}

export default function SignInPage() {
  return <SignInScreen />
}
