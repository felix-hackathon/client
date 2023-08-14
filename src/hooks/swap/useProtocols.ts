import { fetcher } from '@/services/api'
import CacheService from '@/services/cache'
import useSWR from 'swr'

const useProtocols = (chainId: number) => {
  const { data, isLoading } = useSWR(`/${chainId}/swap/protocols`, async (url) => {
    const key = `swap-protocols-${chainId}`
    const data = CacheService.get(key)
    if (data) {
      return data
    }
    const res = await fetcher({
      url,
      throwError: false,
    })
    if (res?.data) {
      CacheService.set(key, res?.data)
      return res.data
    }
    return null
  })

  return {
    protocols: data || [],
    isLoading,
  }
}

export default useProtocols
