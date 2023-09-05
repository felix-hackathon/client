import { fetcher } from '@/services/api'
import useSWR from 'swr'

const useTokens = ({ chainId }: { chainId?: number }) => {
  const { data, isLoading } = useSWR(
    () => {
      if (chainId) {
        return [`tokens`, chainId]
      }
      return null
    },
    async (queryKey) => {
      const chainId = queryKey[1]
      const resTokens = await fetcher({
        url: `/${chainId}/swap/tokens`,
      })
      return resTokens?.data || []
    }
  )

  return {
    tokens: data || [],
    loading: isLoading,
  }
}

export default useTokens
