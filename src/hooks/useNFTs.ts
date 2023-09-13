import { fetcher } from '@/services/api'
import useSWR from 'swr'

const useNFTs = ({ chainId, owner }: { chainId: number; owner?: string }) => {
  const { data, isLoading } = useSWR(
    () => {
      if (chainId) {
        return ['nfts', { chainId, owner }]
      }
      return null
    },
    async (queryKey) => {
      const nftQuery = queryKey[1] as { chainId: number; owner?: string }
      const res = await fetcher({
        url: `/nft`,
        query: {
          chainId: nftQuery?.chainId,
          ...(nftQuery?.owner ? { owner: nftQuery?.owner } : {}),
        },
        auth: false,
      })
      const nfts = res?.data
      return nfts
    }
  )

  return {
    nfts: data || [],
    loading: isLoading,
  }
}

export default useNFTs
