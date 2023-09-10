import LayoutClient from '../(app)/layout.client'
import { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'NFT Virtual Shopping',
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

export default async function Layout({ children }: { children: React.ReactNode }) {
  return <LayoutClient>{children}</LayoutClient>
}
