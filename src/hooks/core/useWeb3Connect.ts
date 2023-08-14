import { useAppDispatch, useAppSelector } from '@/hooks/core/useRedux'
import { setUser } from '@/services/redux/slices/user'
import { watchAccount } from '@wagmi/core'
import { useEffect } from 'react'
import { useAccount } from 'wagmi'
import CookieService, { CookieKeys } from '@/services/cookie'
import useAuth from './useAuth'

const useWeb3Connect = () => {
  const dispatch = useAppDispatch()
  const { isConnected, newAccount } = useAuth()

  useAccount({
    async onConnect({ address }) {
      if (address) {
        await newAccount(address)
      }
    },
    async onDisconnect() {
      const tokenKeys = await CookieService.getAllKeys([CookieKeys.AccessToken, CookieKeys.RefreshToken])
      await CookieService.remove(tokenKeys)
      dispatch(setUser(null))
    },
  })

  useEffect(() => {
    const unwatch = watchAccount(async ({ address }) => {
      if (address && isConnected) {
        await newAccount(address)
      }
    })

    return () => {
      unwatch()
    }
  }, [dispatch, isConnected, newAccount])
}

export default useWeb3Connect
