'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Section } from '@/components/ui/section'
import { APP_URL } from '@/utils/app/links'

export default function RootErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <Section className="relative h-screen">
      <div className="pt-8 md:pt-12 lg:pt-16 pb-8 md:pb-12 lg:pb-12 px-4 md:px-8 lg:px-16 xl:px-36 h-full overflow-y-auto grid place-items-center">
        <div className="flex-col justify-between items-center inline-flex w-full h-full">
          <div className="h-full w-full 3xl:my-auto my-0">
            <div className="w-full h-10 justify-between items-center inline-flex">
              <div className="grow shrink basis-0 h-10 justify-start items-center gap-5 flex">
                <div className="text-black text-xl md:text-2xl lg:text-3xl font-medium leading-10">
                  ZapLink Tracker
                </div>
              </div>
            </div>

            <div className="h-full flex w-full flex-col justify-center my-auto">
              <div className="pb-8 md:pb-12 lg:pb-16 flex-col justify-center items-center gap-6 md:gap-8 lg:gap-10 inline-flex">
                <div className="self-stretch h-auto min-h-[140px] md:min-h-[170px] flex-col justify-start items-center gap-2.5 flex">
                  {/* <SeparatorText
                    text="500"
                    className="max-w-48 md:max-w-56 text-lg"
                  /> */}
                  <div className="self-stretch text-center text-black text-3xl md:text-4xl lg:text-5xl font-medium leading-tight md:leading-normal lg:leading-[57.60px]">
                    Oops...
                  </div>
                  <div className="self-stretch text-center text-black text-base md:text-lg lg:text-xl font-medium leading-normal">
                    Isso é embaraçoso, mas aconteceu um erro inesperado. <br />
                    Nossos sistemas devem estar sofrendo agora. Você pode tentar
                    novamente mais tarde.
                  </div>
                </div>
                <div className="justify-center items-center gap-3 md:gap-5 flex flex-col md:flex-row w-full md:w-auto">
                  <Link
                    href={APP_URL.toString()}
                    passHref
                    prefetch
                    className="w-full md:w-auto"
                  >
                    <Button variant="outline" className="w-full md:w-auto">
                      Voltar para o início
                    </Button>
                  </Link>

                  <Button onClick={reset} className="w-full md:w-auto">
                    Recarregar a página
                  </Button>
                </div>

                <div className="self-stretch text-center text-muted-foreground text-xs break-all">
                  {error.digest
                    ? `Digest: ${error.digest}`
                    : 'No digest available'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}
