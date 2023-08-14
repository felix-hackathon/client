import { fetcher } from '@/services/api'
import useSWR from 'swr'

export type QuotePayload = {
  src: string
  dst: string
  amount: string
  protocols?: string
  fee?: string
  includeTokensInfo?: boolean
  includeProtocols?: boolean
  includeGas?: boolean
  gasLimit?: string
  connectorTokens?: string
  complexityLevel?: string
  mainRouteParts?: string
  parts?: string
  gasPrice?: string
}

const useQuote = (chainId: number, query: QuotePayload) => {
  const { data, isLoading } = useSWR(`/${chainId}/swap/quote`, async (url) => {
    const res = await fetcher({
      url,
      query,
      throwError: false,
    })
    return res?.data || null
  })

  return {
    data,
    isLoading,
  }
}

export default useQuote
