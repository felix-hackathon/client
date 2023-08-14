import './globals.scss'
import { Roboto_Mono } from 'next/font/google'
import Providers from '@/providers'
import LayoutClient from './layout.client'
import { Metadata } from 'next'
import { getLanguage } from '@/languages'
import { Locale } from '@/languages/config'

const inter = Roboto_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Test',
  manifest: '/manifest.json',
  icons: ['/favicon.ico'],
  themeColor: '#ffffff',
  description: 'Generated by create next app',
  viewport: {
    width: 'device-width',
    userScalable: true,
    initialScale: 1,
    maximumScale: 5,
  },
}

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'vi' }]
}

export default async function RootLayout({ children, params: { locale } }: { children: React.ReactNode; params: { locale: Locale } }) {
  const language = await getLanguage(locale)
  return (
    <html lang='en'>
      <body className={inter.className} suppressHydrationWarning={true}>
        <Providers language={language}>
          <LayoutClient>{children}</LayoutClient>
        </Providers>
      </body>
    </html>
  )
}
