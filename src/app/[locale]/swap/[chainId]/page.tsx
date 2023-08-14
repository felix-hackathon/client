import { Metadata } from 'next'
import SwapClient from './page.client'

export const metadata: Metadata = {
  title: 'Swap Token',
}

export default async function Swap({ params: { chainId } }: { params: { chainId: string } }) {
  return <SwapClient chainId={parseInt(chainId)} />
}
