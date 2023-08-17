import { useMemo } from 'react'
import { useAppSelector } from './useRedux'

const useAuth = () => {
  const user = useAppSelector((state) => state.user)
  const kaikas = useAppSelector((state) => state.kaikas)

  const isConnected = useMemo(() => !!kaikas, [kaikas])
  const isSigned = useMemo(() => isConnected && !!user?.isSigned, [isConnected, user])

  return {
    isConnected,
    isSigned,
    userAddress: user?.address || null,
  }
}

export default useAuth
