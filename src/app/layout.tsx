import type { Metadata, Viewport } from "next";
import '@/styles/globals.css'
import { Toaster } from "@/components/ui/sonner";
import { createFontClassList } from "@/utils/fonts";
import { cn } from "@/lib/utils";
import { QueryProvider } from "@/lib/providers";

export const metadata: Metadata = {
  title: {
    default: 'ZapLink Tracker',
    template: '%s | ZapLink Tracker',
  },
  description: 'Track and manage your WhatsApp marketing links with ease',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={cn(createFontClassList(), "antialiased")}
      >
        <QueryProvider>
          {children}
        </QueryProvider>
        <Toaster position="bottom-right" richColors closeButton />
      </body>
    </html>
  );
}
