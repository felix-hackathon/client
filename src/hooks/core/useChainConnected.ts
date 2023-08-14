import { useMemo } from 'react'
import { useAppSelector } from './useRedux'
import { chainsSupported } from '@/common/constants/chains'

const useChainConnected = () => {
  const chainId = useAppSelector((state) => state.chain)
  const chain = useMemo(() => {
    const item = chainsSupported.find((c) => c.id === chainId)
    if (item) {
      return item
    }
    return {
      id: chainId,
      name: '',
    }
  }, [chainId])

  return {
    chainId,
    chain,
  }
}

export default useChainConnected
