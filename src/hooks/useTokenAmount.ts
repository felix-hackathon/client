import { NativeTokens } from '@/common/constants/web3'
import AppConfig from '@/config'
import Web3Service from '@/services/web3'
import useSWR from 'swr'

const useTokenAmount = ({
  chainId,
  tokenAddress,
  userAddress,
  amountOut,
}: {
  chainId: number
  tokenAddress: string
  userAddress: string
  amountOut: string
}) => {
  const { data, isLoading, error } = useSWR(
    () => {
      if (chainId && tokenAddress) {
        return ['tokenAmount', { chainId, tokenAddress, amountOut, userAddress }]
      }
      return null
    },
    async (queryKey) => {
      const query = queryKey[1]
      if (NativeTokens.includes(query.tokenAddress)) {
        return amountOut
      }
      // const tokenAmount = await Web3Service.getTokenInAmount(query.chainId, query?.userAddress as string, query?.tokenAddress, query?.amountOut)
      const result = await Web3Service.getAmountsIn({
        chainId: query.chainId,
        amountOut: query.amountOut,
        path: [query.tokenAddress, AppConfig.WKLAY],
      })
      return result
    }
  )
  console.log(error)
  return {
    tokenAmount: data || '0',
    loading: isLoading,
  }
}

export default useTokenAmount
