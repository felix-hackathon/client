import useTokens from './useTokens'
import { useMemo } from 'react'

const useToken = ({ chainId, address }: { chainId?: number; address: string }) => {
  const { tokens, loading } = useTokens({ chainId })
  const token = useMemo(() => {
    return tokens?.find((i: any) => i.address?.toLowerCase() === address?.toLowerCase())
  }, [tokens, address])
  return {
    token,
    loading,
  }
}

export default useToken
