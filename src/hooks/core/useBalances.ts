import Web3Service from '@/services/web3'
import { ethers } from 'ethers'
import useSWR from 'swr'

const useBalances = ({ userAddress, tokenAddresses, chainId }: { userAddress?: string; tokenAddresses?: string[]; chainId?: number }) => {
  const { data, isLoading } = useSWR(
    () => {
      if (ethers.isAddress(userAddress) && tokenAddresses?.length && chainId) {
        return [`balance`, userAddress, tokenAddresses, chainId]
      }
      return null
    },
    async (queryKey) => {
      const userAddress = queryKey[1]
      const tokenAddresses = queryKey[2]
      const chainId = queryKey[3]
      const res = await Web3Service.getBalances({
        chainId,
        tokenAddresses,
        userAddress,
      })
      return res
    }
  )

  return {
    balances: data || null,
    loadingBalances: isLoading,
  }
}

export default useBalances
