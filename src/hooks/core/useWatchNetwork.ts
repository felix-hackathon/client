import { disconnect, switchNetwork } from '@wagmi/core'
import { useEffect } from 'react'
import { useAccount, useNetwork } from 'wagmi'
import { useAppDispatch, useAppSelector } from './useRedux'
import { setChain } from '@/services/redux/slices/chain'
import { chainsSupported } from '@/common/constants/chains'

const useWatchNetwork = () => {
  const { chain } = useNetwork()
  const { connector } = useAccount()
  const dispatch = useAppDispatch()
  const chainId = useAppSelector((state) => state.chain)

  useEffect(() => {
    ;(async () => {
      if (chain?.unsupported && connector) {
        await switchNetwork({ chainId }).catch(async () => {
          await disconnect()
        })
      }
    })()
  }, [chain, connector, chainId])

  useEffect(() => {
    if (chain?.id && chainsSupported.map((c) => c.id).includes(chain.id)) {
      dispatch(setChain(chain.id))
    }
  }, [chain, dispatch])
}

export default useWatchNetwork
