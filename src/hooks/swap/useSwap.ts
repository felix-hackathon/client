import { fetcher } from '@/services/api'
import KaikasService from '@/services/kaikas'
import { mutate } from 'swr'
import useSWRMutation from 'swr/mutation'

type ISwap = {
  from: {
    token: string
    amount: string
    chainId: number
    decimals: number
  }
  to: {
    token: string
    amount: string
    chainId: number
    decimals: number
  }
  userAddress: string
}

const useSwap = (chainId: number) => {
  const { data, isMutating, error, trigger } = useSWRMutation(`/${chainId}/swap`, async (url, { arg }: { arg: ISwap }) => {
    const res = await fetcher({
      url,
      query: {
        src: arg.from.token,
        dst: arg.to.token,
        amount: arg.from.amount,
        from: arg.userAddress,
        slippage: 10,
      },
    })
    if (res?.data) {
      const rawTx = await KaikasService.signTransaction({
        type: 'FEE_DELEGATED_SMART_CONTRACT_EXECUTION',
        to: res.data.tx.to,
        data: res.data.tx.data,
        from: res.data.tx.from,
        gas: res.data.tx.gas,
        value: res.data.tx.value,
      }).catch(() => null)
      if (rawTx) {
        const resTx = await fetcher({
          url,
          method: 'POST',
          body: {
            rawTx,
          },
        })
        mutate([`balance`, arg.userAddress, arg.to.token, chainId])
        mutate([`token-swap-info`, arg.userAddress, arg.from.token, chainId, res?.data?.tx?.to])
        return resTx
      }
    }
    return null
  })
  return {
    trigger,
    swapData: data,
    loadingSwap: isMutating,
    swapError: error,
  }
}

export default useSwap
