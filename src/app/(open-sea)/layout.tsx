import { Metadata } from 'next'
import LayoutClient from './layout.client'

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

export default async function Layout({ children }: { children: React.ReactNode }) {
  return <LayoutClient>{children}</LayoutClient>
}
