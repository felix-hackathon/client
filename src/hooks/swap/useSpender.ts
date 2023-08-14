import { fetcher } from '@/services/api'
import CacheService from '@/services/cache'
import useSWR from 'swr'

const useSpender = (chainId: number) => {
  const { data, isLoading } = useSWR(`/${chainId}/swap/spender`, async (url) => {
    const key = `swap-spender-${chainId}`
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
    spender: data || null,
    isLoading,
  }
}

export default useSpender
