import Web3Service from '@/services/web3'
import useSWR from 'swr'

const useNFT = ({ chainId, address, id }: { chainId: number; address: `0x${string}`; id: string }) => {
  const { data, isLoading, error } = useSWR(
    () => {
      if (chainId && address && id) {
        return ['nft', { chainId, address, id }]
      }
      return null
    },
    async (queryKey) => {
      const nftQuery = queryKey[1] as { chainId: number; address: `0x${string}`; id: string }
      const info = await Web3Service.getCarInfo({ address: nftQuery.address, chainId: nftQuery.chainId, id: nftQuery.id })
      return ''
    }
  )

  return {
    nft: data || [],
    loading: isLoading,
  }
}

export default useNFT
