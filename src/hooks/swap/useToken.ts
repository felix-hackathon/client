import { useMemo } from 'react'
import useTokens from './useTokens'

const useToken = (address: string, chainId: number) => {
  const { tokens, loadingTokens } = useTokens(chainId)
  const token = useMemo(() => {
    if (tokens) {
      return tokens.find((i: any) => i.address === address.toLowerCase()) || null
    }
    return null
  }, [tokens, address])

  return {
    token,
    loadingToken: loadingTokens,
  }
}

export default useToken
