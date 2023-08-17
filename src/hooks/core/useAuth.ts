import { useMemo } from 'react'
import { useAppSelector } from './useRedux'

const useAuth = () => {
  const user = useAppSelector((state) => state.user)
  const kaikas = useAppSelector((state) => state.kaikas)

  const isConnected = useMemo(() => !!kaikas, [kaikas])
  const isSigned = useMemo(() => isConnected && !!user?.isSigned, [isConnected, user])

  // const handleSign = useCallback(async () => {
  //   if (account && connector) {
  //     setIsSigning(true)
  //     const walletClient = await connector.getWalletClient()
  //     const resSignData = await fetcher({
  //       url: '/authentication/sign',
  //       query: {
  //         address: account,
  //       },
  //     }).catch(() => {
  //       return null
  //     })

  //     if (resSignData) {
  //       const signature = await window.caver.klay.sign(resSignData?.data?.message, account)
  //       if (signature) {
  //         const resSign = await fetcher({
  //           url: '/authentication/sign',
  //           method: 'POST',
  //           body: {
  //             address: account,
  //             signature,
  //           },
  //         }).catch(() => {
  //           return null
  //         })
  //         if (resSign) {
  //           const userData = resSign?.data
  //           await CookieService.set(`${CookieKeys.AccessToken}::${userData?.address}`, userData?.accessToken)
  //           await CookieService.set(`${CookieKeys.RefreshToken}::${userData?.address}`, userData?.refreshToken)
  //           dispatch(
  //             setUser({
  //               address: userData?.address || null,
  //               name: userData?.name || '',
  //               email: userData?.email || '',
  //               avatar: userData?.avatar || '',
  //               isSigned: true,
  //             })
  //           )
  //         } else {
  //           await disconnect()
  //         }
  //       }
  //     }
  //     setIsSigning(false)
  //   }
  // }, [account, connector, dispatch, setIsSigning])

  return {
    isConnected,
    isSigned,
    userAddress: user?.address || null,
  }
}

export default useAuth
