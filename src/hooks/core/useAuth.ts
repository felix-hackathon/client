const useAuth = () => {
  // const { isConnected: connected, isConnecting: connecting, isReconnecting: reconnecting, connector } = useAccount()
  // const user = useAppSelector((state) => state.user)
  // const [accounts, setAccounts] = useState<string[]>([])
  // const [account, setAccount] = useState<string | null>(null)

  // const isConnected = useMemo(() => connected && !connecting && !reconnecting, [connected, connecting, reconnecting])
  // const isSigned = useMemo(() => !!isConnected && !!user?.isSigned, [isConnected, user])
  // const [isSigning, setIsSigning] = useContext(Web3Context)
  // const dispatch = useAppDispatch()

  // useEffect(() => {
  //   const getAccounts = async () => {
  //     if (connector && isConnected) {
  //       if (connector.id === 'walletConnect') {
  //         const provider = await connector.getProvider()
  //         setAccounts((provider?.accounts || []).map((i: string) => i.toLowerCase()))
  //         setAccount(user?.address?.toLowerCase() || null)
  //       } else if (connector?.id === 'injected') {
  //         setAccounts(user?.address?.toLowerCase() ? [user?.address?.toLowerCase()] : [])
  //         setAccount(user?.address?.toLowerCase() || null)
  //       }
  //     } else {
  //       setAccounts([])
  //       setAccount(null)
  //     }
  //   }
  //   getAccounts()
  // }, [connector, user, isConnected])

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

  // const newAccount = useCallback(
  //   async (address: string) => {
  //     const refreshToken = await CookieService.get(`${CookieKeys.RefreshToken}::${address?.toLowerCase()}`)
  //     if (refreshToken) {
  //       const refreshUser = await fetcher({
  //         url: '/authentication/refresh',
  //         method: 'POST',
  //         body: {
  //           refreshToken,
  //         },
  //       }).catch(() => null)
  //       if (refreshUser?.data?.address === address?.toLowerCase()) {
  //         const refreshUserData = refreshUser?.data
  //         await CookieService.set(`${CookieKeys.AccessToken}::${refreshUserData?.address}`, refreshUserData?.accessToken)
  //         await CookieService.set(`${CookieKeys.RefreshToken}::${refreshUserData?.address}`, refreshUserData?.refreshToken)
  //         dispatch(
  //           setUser({
  //             address: refreshUserData?.address,
  //             avatar: refreshUserData?.avatar || '',
  //             name: refreshUserData?.name || '',
  //             email: refreshUserData?.email || '',
  //             isSigned: true,
  //           })
  //         )
  //       } else {
  //         await CookieService.remove([`${CookieKeys.AccessToken}::${address?.toLowerCase()}`, `${CookieKeys.RefreshToken}::${address?.toLowerCase()}`])
  //         dispatch(
  //           setUser({
  //             address: address?.toLowerCase() || '',
  //             avatar: '',
  //             name: '',
  //             email: '',
  //             isSigned: false,
  //           })
  //         )
  //       }
  //     } else {
  //       dispatch(
  //         setUser({
  //           address: address?.toLowerCase() || '',
  //           avatar: '',
  //           name: '',
  //           email: '',
  //           isSigned: false,
  //         })
  //       )
  //     }
  //   },
  //   [dispatch]
  // )

  return {
    isConnected: false,
    connector: null,
    isSigned: false,
    isSigning: false,
    handleSign: () => {},
    newAccount: () => {},
    accounts: [],
    account: null,
  }
}

export default useAuth
