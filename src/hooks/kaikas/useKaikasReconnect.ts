import KaikasService from '@/services/kaikas'
import { useEffect } from 'react'

const useKaikasReconnect = () => {
  useEffect(() => {
    ;(async () => {
      await KaikasService.reconnect()
    })()
  }, [])
}

export default useKaikasReconnect
