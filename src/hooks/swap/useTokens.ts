import useSWR from 'swr'

const useTokens = (chainId: number) => {
  const { data, isLoading } = useSWR(
    `swap-token-${chainId}`,
    async () => {
      const keyListToken = `swap-list-tokens-${chainId}`
      const { fetcher } = await import('@/services/api')
      const CacheService = (await import('@/services/cache')).default
      const LocalStorageService = (await import('@/services/storage')).default
      const getTokensInfo = (await import('@/utils/getTokensInfo')).default
      let tokens = CacheService.get(keyListToken)
      if (!tokens) {
        const res = await fetcher({
          url: `/${chainId}/swap/tokens`,
          throwError: false,
        })
        if (res?.data) {
          CacheService.set(keyListToken, res?.data)
          tokens = res.data
        } else {
          tokens = []
        }
      }
      const listTokenAddresses = tokens.map((i: any) => i.address)
      const keyListCustomToken = `swap-list-custom-token-${chainId}`
      const customTokensAddresses = (LocalStorageService.get(keyListCustomToken) || []).filter(
        (tokenAddress: string) => !listTokenAddresses.includes(tokenAddress?.toLowerCase())
      )
      if (customTokensAddresses.length > 0) {
        const infoCustomTokens = await getTokensInfo(chainId, customTokensAddresses)
        tokens = [...tokens, ...infoCustomTokens]
      }
      return tokens || []
    },
    {
      dedupingInterval: 10000,
    }
  )

  return {
    tokens: data || [],
    loadingTokens: isLoading,
  }
}

export default useTokens
