import { isAddress } from 'ethers'
import useSWR from 'swr'

const useBalance = ({ userAddress, tokenAddress, chainId }: { userAddress?: string; tokenAddress?: string; chainId?: number }) => {
  const { data, isLoading } = useSWR(
    () => {
      if (isAddress(userAddress) && isAddress(tokenAddress) && chainId) {
        return [`balance`, userAddress, tokenAddress, chainId]
      }
      return null
    },
    async (queryKey) => {
      const userAddress = queryKey[1]
      const tokenAddress = queryKey[2]
      const chainId = queryKey[3]
      const Web3Service = (await import('@/services/web3')).default
      const res = await Web3Service.getBalance({
        chainId,
        tokenAddress,
        userAddress,
      })

      return `${res}`
    },
    {
      revalidateOnFocus: false,
    }
  )

  return {
    balance: data || null,
    loadingBalance: isLoading,
  }
}

export default useBalance
