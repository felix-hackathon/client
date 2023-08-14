import { NativeTokens } from '@/common/constants/web3'
import ConfigService from '@/services/config'
import Web3Service from '@/services/web3'

const getTokensInfo = async (chainId: number, tokens: string[]) => {
  const result: {
    address: string
    decimals: number
    chainId: number
    icon: string | null
    name: string
    symbol: string
    tags: string[]
  }[] = []
  const tokensInfo = await Web3Service.getBatchERC20Info(
    chainId,
    tokens.filter((address) => !NativeTokens.includes(address?.toLowerCase()))
  )
  const chain = await ConfigService.getChain(chainId)
  for (let i = 0; i < tokens.length; i++) {
    const address = tokens[i].toLowerCase()
    const info = tokensInfo.find((i) => i.address?.toLowerCase() === address && i.chainId === chainId)
    const isNative = NativeTokens.includes(address)
    const tags = isNative ? ['native'] : ['tokens']
    if (!isNative) {
      result.push({
        address,
        decimals: parseInt(`${info?.decimals}`),
        icon: null,
        name: info?.name || '',
        symbol: info?.symbol || '',
        tags,
        chainId,
      })
    } else {
      result.push({
        address,
        decimals: chain?.nativeCurrency?.decimals || 18,
        name: chain?.nativeCurrency?.name || '',
        icon: null,
        symbol: chain?.nativeCurrency?.symbol || '',
        tags,
        chainId,
      })
    }
  }
  return result
}

export default getTokensInfo
