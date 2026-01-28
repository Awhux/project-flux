import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Section } from '@/components/ui/section'
import { APP_URL } from '@/utils/app/links'

export const metadata = {
  title: 'Página não encontrada',
}

export const runtime = 'edge'

export default function NotFoundPage() {
  return (
    <Section className="relative h-screen">
      <div className="pt-8 md:pt-12 lg:pt-16 pb-8 md:pb-12 lg:pb-12 px-4 md:px-8 lg:px-16 xl:px-36 h-full overflow-y-auto grid place-items-center">
        <div className="flex-col justify-between items-center inline-flex w-full h-full">
          <div className="h-full w-full 3xl:my-auto my-0">
            <div className="w-full h-10 justify-between items-center inline-flex">
              <div className="grow shrink basis-0 h-10 justify-start items-center gap-5 flex">
                <div className="text-foreground text-xl md:text-2xl lg:text-3xl font-medium leading-10">
                  ZapLink Tracker
                </div>
              </div>
            </div>

            <div className="h-full flex w-full flex-col justify-center my-auto">
              <div className="pb-8 md:pb-12 lg:pb-16 flex-col justify-center items-center gap-6 md:gap-8 lg:gap-10 inline-flex">
                <div className="self-stretch text-foreground h-auto min-h-[120px] md:min-h-[150px] flex-col justify-start items-center gap-2.5 flex">
                  {/* <SeparatorText
                    text="404"
                    className="max-w-48 md:max-w-56 text-lg"
                  /> */}
                  <div className="self-stretch text-center text-foreground text-3xl md:text-4xl lg:text-5xl font-medium leading-tight md:leading-normal lg:leading-[57.60px]">
                    Página não encontrada.
                  </div>
                  <div className="self-stretch text-center text-muted-foreground text-base md:text-lg lg:text-xl font-medium leading-normal">
                    A página que você está procurando foi movida, removida ou
                    nunca existiu.
                  </div>
                </div>
                <div className="justify-start items-start gap-5 inline-flex">
                  <Link href={APP_URL.toString()} passHref prefetch>
                    <Button>Voltar para o início</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}
