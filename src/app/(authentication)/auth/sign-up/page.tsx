import type { Metadata } from 'next'
import SignUpScreen from '@/features/authentication/components/sign-up/sign-up-screen'

export const metadata: Metadata = {
  title: 'Comece agora com Plenus',
  description: 'Comece agora com Plenus para controlar seu negócio',
}

export default function SignUpPage() {
  return <SignUpScreen />
}
