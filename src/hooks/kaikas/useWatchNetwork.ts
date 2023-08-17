import { useEffect } from 'react'
import { useAppSelector } from '../core/useRedux'
import KaikasService from '@/services/kaikas'

const useWatchNetwork = () => {
  const kaikas = useAppSelector((state) => state.kaikas)

  useEffect(() => {
    ;(async () => {
      if (kaikas) {
        if (kaikas.chainId !== parseInt(process.env.NEXT_PUBLIC_DEFAULT_CHAIN || '8217')) {
          await KaikasService.switchChain(parseInt(process.env.NEXT_PUBLIC_DEFAULT_CHAIN || '8217')).catch(async () => {
            await KaikasService.disconnect()
          })
        }
      }
    })()
  }, [kaikas])
}

export default useWatchNetwork
