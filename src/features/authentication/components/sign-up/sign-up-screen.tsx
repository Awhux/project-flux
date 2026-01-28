import Image from 'next/image'
import Link from 'next/link'
import { PlenusIcon } from '@/components/icons/logo'
import SignUpForm from './form/sign-up.form'

export default function SignUpScreen() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-4 font-medium">
            <PlenusIcon className="size-10" />
            <span className="text-2xl font-medium">Plenus</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">
            <SignUpForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <Image
          src="/placeholder.svg"
          alt="Imagem"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          width={1000}
          height={1000}
        />
      </div>
    </div>
  )
}
