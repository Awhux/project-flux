'use client'

import { SignInEmailForm } from '@/features/authentication/components/sign-in/form/sign-in.form'

export default function SignInScreen() {
  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignInEmailForm />
      </div>
    </div>
  )
}
