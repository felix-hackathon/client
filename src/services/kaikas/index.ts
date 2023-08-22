import { fetcher } from '../api'
import CookieService, { CookieKeys } from '../cookie'
import ReduxService from '../redux/service'
import { setKaikas } from '../redux/slices/kaikas'
import { setUser } from '../redux/slices/user'
import LocalStorageService from '../storage'
import Web3Service from '../web3'

export const isKaikas = typeof window !== 'undefined' && window.klaytn && window.klaytn.isKaikas
export default class KaikasService {
  static async initialize() {
    if (!isKaikas) {
      // throw Error('Kaikas is not installed')
      window.open('https://chrome.google.com/webstore/detail/kaikas/jblndlipeogpafnldhgmapagcccfchpi', '_blank')
      return
    }
    try {
      await window.klaytn.enable()
      await this.connect()
      return true
    } catch (error) {
      return false
    }
  }

  static async reconnect() {
    if (LocalStorageService.get('kaikas-connected')) {
      console.log(`Kaikas reconnect...`)
      await this.initialize()
    }
  }

  static async connect() {
    console.log(`Kaikas connect ${window.klaytn.selectedAddress?.toLowerCase()}`)
    this.syncRedux()
    LocalStorageService.set('kaikas-connected', true)
    await this.refreshToken()
    this.subscribeEvent()
  }

  static async disconnect() {
    console.log(`Kaikas disconnect`)
    LocalStorageService.remove('kaikas-connected')
    this.unsubscribeEvent()
    const tokenKeys = await CookieService.getAllKeys([CookieKeys.AccessToken, CookieKeys.RefreshToken])
    await CookieService.remove(tokenKeys)
    ReduxService.dispatch(setKaikas(null))
    ReduxService.dispatch(setUser(null))
  }

  static syncRedux() {
    ReduxService.dispatch(
      setKaikas({
        address: `${window.klaytn.selectedAddress?.toLowerCase()}`,
        chainId: parseInt(`${window.klaytn.networkVersion}`),
      })
    )
  }

  static subscribeEvent() {
    this.unsubscribeEvent()
    console.log('Subscribe event kaikas')
    window.klaytn.on('accountsChanged', () => {
      console.log(`Account changed`, window.klaytn.selectedAddress)
      this.syncRedux()
      this.refreshToken()
    })
    window.klaytn.on('networkChanged', (chainId: any) => {
      if (chainId !== 'loading') {
        console.log(`Network changed`, window.klaytn.networkVersion)
        this.syncRedux()
      }
    })
    window.klaytn.on('disconnected', () => {
      this.disconnect()
    })
  }

  static unsubscribeEvent() {
    console.log('Unsubscribe event kaikas')
    window.klaytn.removeAllListeners()
  }

  static async switchChain(chainId: number) {
    try {
      window.klaytn.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${Number(chainId).toString(16)}` }],
      })
      return true
    } catch (error) {
      return false
    }
  }

  static async refreshToken() {
    const address = window.klaytn.selectedAddress
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
        ReduxService.dispatch(
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
        ReduxService.dispatch(
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
      ReduxService.dispatch(
        setUser({
          address: address?.toLowerCase() || '',
          avatar: '',
          name: '',
          email: '',
          isSigned: false,
        })
      )
    }
  }

  static async signIn() {
    try {
      const account = window.klaytn.selectedAddress
      const resSignData = await fetcher({
        url: '/authentication/sign',
        query: {
          address: window.klaytn.selectedAddress,
        },
        throwError: false,
      })

      if (resSignData) {
        const signature = await this.signMessage(resSignData?.data?.message, account)
        if (signature) {
          const resSign = await fetcher({
            url: '/authentication/sign',
            method: 'POST',
            body: {
              address: account,
              signature,
            },
          }).catch(() => {
            return null
          })
          if (resSign) {
            const userData = resSign?.data
            await CookieService.set(`${CookieKeys.AccessToken}::${userData?.address}`, userData?.accessToken)
            await CookieService.set(`${CookieKeys.RefreshToken}::${userData?.address}`, userData?.refreshToken)
            ReduxService.dispatch(
              setUser({
                address: userData?.address || null,
                name: userData?.name || '',
                email: userData?.email || '',
                avatar: userData?.avatar || '',
                isSigned: true,
              })
            )
            return true
          } else {
            await this.disconnect()
            return false
          }
        }
      } else {
        return false
      }
    } catch (error) {
      console.error(error)
      return false
    }
  }

  static async signMessage(message: string, account: string) {
    const res = await await window.caver.klay.sign(message, account).catch(() => null)
    return res
  }

  static async sendTransaction({
    to,
    data,
    from,
    gas,
    gasPrice,
    nonce,
    value,
    chainId,
    callbackAfterDone,
    callbackBeforeDone,
    callbackError,
  }: {
    from?: string
    to: string
    value?: string
    gas?: number
    chainId?: number
    gasPrice?: number
    data?: string
    nonce?: number
    callbackError?: (error?: any) => any
    callbackBeforeDone?: (hash?: string) => any
    callbackAfterDone?: (receipt?: any) => any
  }) {
    if (!from) {
      from = window.klaytn.selectedAddress as string
    }
    if (!gasPrice) {
      const feeData = await Web3Service.getFeeData(chainId || parseInt(`${window.klaytn.networkVersion}`))
      if (feeData?.gasPrice) {
        gasPrice = parseInt(`${feeData?.gasPrice}`)
      } else {
        gasPrice = 50000000000
      }
    }
    if (!gas) {
      const gasLimit = await Web3Service.estimateGas({
        from,
        chainId: chainId || parseInt(`${window.klaytn.networkVersion}`),
        to,
        value: '1000000000000000000',
      })
      if (gasLimit) {
        gas = parseInt(gasLimit.toString())
      } else {
        gas = 21_000
      }
    }
    return new Promise((resolve, reject) => {
      window.caver.klay
        .sendTransaction({
          from: from || window.klaytn.selectedAddress,
          to,
          value,
          data,
          gas,
          gasPrice,
          nonce,
        })
        .on('transactionHash', (hash: string) => {
          console.log('Tx hash: ', hash)
          callbackBeforeDone && callbackBeforeDone(hash)
        })
        .on('receipt', (receipt: any) => {
          console.log('Tx Receipt: ', receipt)
          callbackAfterDone && callbackAfterDone(receipt)
          resolve(receipt)
        })
        .on('error', (error: any) => {
          console.error('Tx Error: ', error)
          callbackError ? callbackError(error) : reject(error)
        })
    })
  }

  static async signTransaction({
    type,
    from,
    gas,
    to,
    value,
    data,
  }: {
    type?: string
    from?: string
    to?: string
    gas?: string
    value?: string
    data?: string
  }) {
    try {
      const res = await window.caver.klay.signTransaction({
        type,
        from,
        gas,
        to,
        value,
        data,
      })
      return res?.rawTransaction || null
    } catch (error) {
      return null
    }
  }
}
