import './globals.scss'
import { Roboto_Mono } from 'next/font/google'
import Providers from '@/providers'
import LayoutClient from './layout.client'
import { Metadata } from 'next'

const inter = Roboto_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'NFT Store',
  manifest: '/manifest.json',
  icons: ['/favicon.ico'],
  themeColor: '#ffffff',
  description: 'NFT Store',
  viewport: {
    width: 'device-width',
    userScalable: true,
    initialScale: 1,
    maximumScale: 5,
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className={inter.className} suppressHydrationWarning={true}>
        <Providers>
          <LayoutClient>{children}</LayoutClient>
        </Providers>
      </body>
    </html>
  )
}
