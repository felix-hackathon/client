import { Metadata } from 'next'
import dynamic from 'next/dynamic'
const SwapClient = dynamic(() => import('./page.client'))

export const metadata: Metadata = {
  title: 'Swap',
}

export default function Swap() {
  return <SwapClient chainId={parseInt(process.env.NEXT_PUBLIC_DEFAULT_CHAIN || '8217')} />
}
