import { fetcher } from '@/services/api'
import { setUser } from '@/services/redux/slices/user'
import { useAppDispatch, useAppSelector } from '@/hooks/core/useRedux'
import { Web3Context } from '@/providers/Web3'
import { disconnect } from '@wagmi/core'
import { ethers } from 'ethers'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { SiweMessage } from 'siwe'
import { useAccount } from 'wagmi'
import CookieService, { CookieKeys } from '@/services/cookie'

const useAuth = () => {
  const { isConnected: connected, isConnecting: connecting, isReconnecting: reconnecting, connector } = useAccount()
  const user = useAppSelector((state) => state.user)
  const [accounts, setAccounts] = useState<string[]>([])
  const [account, setAccount] = useState<string | null>(null)

  const chainId = useAppSelector((state) => state.chain)
  const isConnected = useMemo(() => connected && !connecting && !reconnecting, [connected, connecting, reconnecting])
  const isSigned = useMemo(() => !!isConnected && !!user?.isSigned, [isConnected, user])
  const [isSigning, setIsSigning] = useContext(Web3Context)
  const dispatch = useAppDispatch()

  useEffect(() => {
    const getAccounts = async () => {
      if (connector && isConnected) {
        if (connector.id === 'walletConnect') {
          const provider = await connector.getProvider()
          setAccounts((provider?.accounts || []).map((i: string) => i.toLowerCase()))
          setAccount(user?.address?.toLowerCase() || null)
        } else if (connector?.id === 'injected') {
          setAccounts(user?.address?.toLowerCase() ? [user?.address?.toLowerCase()] : [])
          setAccount(user?.address?.toLowerCase() || null)
        }
      } else {
        setAccounts([])
        setAccount(null)
      }
    }
    getAccounts()
  }, [connector, user, isConnected])

  const handleSign = useCallback(async () => {
    if (account && connector) {
      setIsSigning(true)
      const walletClient = await connector.getWalletClient({
        chainId,
      })
      const resNonce = await fetcher({
        url: '/authentication/sign',
        query: {
          address: account,
        },
      }).catch(() => {
        return null
      })

      if (resNonce) {
        const message = new SiweMessage({
          domain: window.location.host,
          address: ethers.getAddress(account),
          statement: 'Sign in with Ethereum to PhygitalX.',
          uri: window.location.origin,
          version: '1',
          chainId,
          nonce: resNonce?.data?.nonce,
        })
        const signature = await walletClient
          ?.signMessage({
            account: account as any,
            message: message.prepareMessage(),
          })
          .catch(() => null)
        if (signature) {
          const resSign = await fetcher({
            url: '/authentication/sign',
            method: 'POST',
            body: {
              message: message.prepareMessage(),
              signature,
            },
          }).catch(() => {
            return null
          })
          if (resSign) {
            const userData = resSign?.data
            await CookieService.set(`${CookieKeys.AccessToken}::${userData?.address}`, userData?.accessToken)
            await CookieService.set(`${CookieKeys.RefreshToken}::${userData?.address}`, userData?.refreshToken)
            dispatch(
              setUser({
                address: userData?.address || null,
                name: userData?.name || '',
                email: userData?.email || '',
                avatar: userData?.avatar || '',
                isSigned: true,
              })
            )
          } else {
            await disconnect()
          }
        }
      }
      setIsSigning(false)
    }
  }, [account, connector, dispatch, chainId, setIsSigning])

  const newAccount = useCallback(
    async (address: string) => {
      const refreshToken = await CookieService.get(`${CookieKeys.RefreshToken}::${address?.toLowerCase()}`)
      if (refreshToken) {
        const refreshUser = await fetcher({
          url: '/authentication/refresh',
          method: 'POST',
          body: {
            refreshToken,
          },
        }).catch(() => null)
        if (refreshUser?.data?.address === address?.toLowerCase()) {
          const refreshUserData = refreshUser?.data
          await CookieService.set(`${CookieKeys.AccessToken}::${refreshUserData?.address}`, refreshUserData?.accessToken)
          await CookieService.set(`${CookieKeys.RefreshToken}::${refreshUserData?.address}`, refreshUserData?.refreshToken)
          dispatch(
            setUser({
              address: refreshUserData?.address,
              avatar: refreshUserData?.avatar || '',
              name: refreshUserData?.name || '',
              email: refreshUserData?.email || '',
              isSigned: true,
            })
          )
        } else {
          await CookieService.remove([`${CookieKeys.AccessToken}::${address?.toLowerCase()}`, `${CookieKeys.RefreshToken}::${address?.toLowerCase()}`])
          dispatch(
            setUser({
              address: address?.toLowerCase() || '',
              avatar: '',
              name: '',
              email: '',
              isSigned: false,
            })
          )
        }
      } else {
        dispatch(
          setUser({
            address: address?.toLowerCase() || '',
            avatar: '',
            name: '',
            email: '',
            isSigned: false,
          })
        )
      }
    },
    [dispatch]
  )

  return {
    isConnected,
    isSigned,
    isSigning,
    handleSign,
    newAccount,
    accounts,
    account,
  }
}

export default useAuth
