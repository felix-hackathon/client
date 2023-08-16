import { fetcher } from '@/services/api'
import { ethers } from 'ethers'
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
  const { data, isLoading, isValidating, error } = useSWR(
    () => {
      if (chainId && query.amount && query.amount !== '0' && ethers.isAddress(query.dst) && ethers.isAddress(query.src) && query.dst !== query.src) {
        return [`/${chainId}/swap/quote`, query]
      }
      return null
    },
    async (queryKey) => {
      const url = queryKey[0]
      const query = queryKey[1]
      const res = await fetcher({
        url,
        query,
      })
      return res?.data || null
    },
    {
      shouldRetryOnError: false,
    }
  )

  return {
    quoteData: data,
    error,
    loadingQuote: isLoading || isValidating,
  }
}

export default useQuote
