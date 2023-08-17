import { fetcher } from '@/services/api'
import KaikasService from '@/services/kaikas'
// import { sendTransaction } from '@wagmi/core'
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
      await KaikasService.sendTransaction({
        to: res.data.tx.to,
        data: res.data.tx.data,
        from: res.data.tx.from,
        gas: res.data.tx.gas,
        gasPrice: res.data.tx.gasPrice,
        chainId,
        value: res.data.tx.value,
      }).catch(() => null)
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
