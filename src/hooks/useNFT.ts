import { Car } from '@/app/(app)/store/[slug]/page.client'
import { fetcher } from '@/services/api'
import useSWR from 'swr'

const cars = Object.values(Car)

const getAttributeValue = (key: string, car: any, items: any[]) => {
  const attr = car?.attribute?.find((att: any) => att.key === key)
  const type = items?.find((n: any) => n.nftAddress?.toLowerCase() === attr?.address.toLowerCase())?.type
  const value = attr?.options.find((option: any) => option.type === type)?.key
  return value
}

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
      const res = await fetcher({
        url: `/nft/${nftQuery.chainId}/${nftQuery.address}/${nftQuery.id}`,
        auth: false,
      })
      const nft = res?.data
      const car = cars.find((e) => e.type === nft?.type)
      const mainColor = getAttributeValue('mainColor', car, nft?.items)
      const caliper = getAttributeValue('caliper', car, nft?.items)
      const rim = getAttributeValue('rim', car, nft?.items)
      const brakeDisk = getAttributeValue('brakeDisk', car, nft?.items)
      const windshield = getAttributeValue('windshield', car, nft?.items)
      const carSlug = car?.key
      const result = {
        ...nft,
        carSlug,
        mainColor,
        caliper,
        rim,
        brakeDisk,
        windshield,
      }
      return result
    }
  )

  return {
    nft: data || {},
    loading: isLoading,
  }
}

export default useNFT
