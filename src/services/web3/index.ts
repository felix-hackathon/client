import { Contract, Interface, Network, ethers, MaxUint256, formatUnits } from 'ethers'
import ConfigService from '../config'
import erc20ABI from './erc20ABI'
import { ContractFunctionConfig, MulticallContracts, Narrow } from 'viem'
import { NativeTokens } from '@/common/constants/web3'
import multicallABI from './multicallABI'
import AppConfig from '@/config'
import carABI from './carABI'
const routerABI = [
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'amountOut',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'amountInMax',
        type: 'uint256',
      },
      {
        internalType: 'address[]',
        name: 'path',
        type: 'address[]',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'deadline',
        type: 'uint256',
      },
    ],
    name: 'swapTokensForExactKLAY',
    outputs: [
      {
        internalType: 'uint256[]',
        name: 'amounts',
        type: 'uint256[]',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]

export type MulticallOptions<TContracts extends ContractFunctionConfig[] = ContractFunctionConfig[]> = {
  chainId: number
  contracts: Narrow<readonly [...MulticallContracts<TContracts>]>
  multicallAddress?: string
  chunkSize?: number
}

export default class Web3Service {
  static async getProvider(chainId: number) {
    const rpc = await ConfigService.getRPC(chainId)
    if (!rpc) {
      throw Error(`RPC ${chainId} not found`)
    }
    const staticNetwork = new Network('', chainId)
    const provider = new ethers.JsonRpcProvider(rpc, staticNetwork, {
      staticNetwork,
    })
    return provider
  }

  static async createMulticallContract(chainId: number, address?: string) {
    const provider = await this.getProvider(chainId)
    const defaultMulticallAddress = '0xcA11bde05977b3631167028862bE2a173976CA11'
    return new Contract(address || defaultMulticallAddress, multicallABI, provider)
  }
  static async createERC20Contract(chainId: number, address: string) {
    const provider = await this.getProvider(chainId)
    return new Contract(address, erc20ABI, provider)
  }

  static async createRouterContract(chainId: number, address: string) {
    const provider = await this.getProvider(chainId)
    return new Contract(address, routerABI, provider)
  }

  static async getTokenInAmount(chainId: number, userAddress: string, tokenInAddress: string, tokenInDecimals: number, tokenOutAmount: string) {
    const swapRouterContract = await this.createRouterContract(chainId, AppConfig.exchangeRouter)

    return swapRouterContract.swapTokensForExactKLAY
      .staticCall(tokenOutAmount, MaxUint256, [tokenInAddress, AppConfig.WKLAY], userAddress, MaxUint256, { from: userAddress })
      .then((transaction) => {
        return formatUnits(transaction[0], tokenInDecimals).toString()
      })
  }

  static encodeAbi(abi: any[], functionName: string, args: any[]) {
    const iface = Interface.from(abi)
    return iface.encodeFunctionData(functionName, args)
  }

  static async multicall<TContracts extends ContractFunctionConfig[] = ContractFunctionConfig[]>(options: MulticallOptions<TContracts>) {
    const { chainId, contracts, multicallAddress, chunkSize = 1024 } = options
    const contract = await this.createMulticallContract(chainId, multicallAddress)
    let results: any = []
    for (let chunkIndex = 0; chunkIndex < contracts.length; chunkIndex += chunkSize) {
      const chunk: any = contracts.slice(chunkIndex, chunkIndex + chunkSize)
      const callsData = chunk.map((currentContract: any) => {
        const iface = Interface.from(currentContract.abi)
        return {
          target: currentContract.address,
          callData: iface.encodeFunctionData(currentContract.functionName, currentContract.args || []),
        }
      })
      const res = await contract.tryAggregate.staticCall(false, callsData)
      const resultsDecoded = res.map(({ success, returnData }: any, i: number) => {
        if (!success || returnData === '0x') return null
        const currentContract: any = contracts[i]
        const iface = Interface.from(currentContract.abi as any)
        return iface.decodeFunctionResult(currentContract.functionName, returnData)
      })
      results = [...results, ...resultsDecoded]
    }
    return results
  }

  static async getERC20Info(address: string, chainId: number) {
    try {
      const erc20Contract = {
        abi: erc20ABI,
        address: address as any,
      }
      const data = await this.multicall({
        chainId,
        contracts: [
          {
            ...erc20Contract,
            functionName: 'name',
          },
          {
            ...erc20Contract,
            functionName: 'decimals',
          },
          {
            ...erc20Contract,
            functionName: 'symbol',
          },
        ],
      })
      let result: {
        address: string
        chainId: number
        name: string | null
        decimals: number | null
        symbol: string | null
      } = {
        address,
        chainId,
        name: null,
        decimals: null,
        symbol: null,
      }
      if (data[0]) {
        result.name = data[0][0]
      }
      if (data[1]) {
        result.decimals = parseInt(`${data[1][0]}`)
      }
      if (data[2]) {
        result.symbol = data[2][0]
      }
      return result
    } catch (error) {
      console.error(error)
    }
  }

  static async getBatchERC20Info(chainId: number, addresses: string[]) {
    const contracts: any[] = []
    const results: {
      address: string
      chainId: number
      name: string
      decimals: number
      symbol: string
    }[] = []
    for (let i = 0; i < addresses.length; i++) {
      const address = addresses[i]
      contracts.push({
        address,
        abi: erc20ABI,
        functionName: 'name',
      })
      contracts.push({
        address,
        abi: erc20ABI,
        functionName: 'decimals',
      })
      contracts.push({
        address,
        chainId,
        abi: erc20ABI,
        functionName: 'symbol',
      })
    }
    const data = await this.multicall({
      chainId,
      contracts,
    })
    for (let i = 0; i < contracts.length; i += 3) {
      results.push({
        address: contracts[i].address,
        chainId,
        name: data[i][0],
        decimals: parseInt(`${data[i + 1][0]}`),
        symbol: data[i + 2][0],
      })
    }
    return results
  }

  static async getBalance({ chainId, tokenAddress, userAddress }: { userAddress: string; tokenAddress: string; chainId: number }) {
    if (NativeTokens.includes(tokenAddress)) {
      const provider = await this.getProvider(chainId)
      return provider.getBalance(userAddress)
    } else {
      const contractToken = await this.createERC20Contract(chainId, tokenAddress)
      return contractToken.balanceOf(userAddress)
    }
  }

  static async getBalances({ chainId, tokenAddresses, userAddress }: { userAddress: string; tokenAddresses: string[]; chainId: number }) {
    const contracts = []
    for (let i = 0; i < tokenAddresses.length; i++) {
      const tokenAddress = tokenAddresses[i].toLowerCase()
      if (NativeTokens.includes(tokenAddress)) {
        contracts.push({
          abi: [
            {
              inputs: [
                {
                  internalType: 'address',
                  name: 'addr',
                  type: 'address',
                },
              ],
              name: 'getEthBalance',
              outputs: [
                {
                  internalType: 'uint256',
                  name: 'balance',
                  type: 'uint256',
                },
              ],
              stateMutability: 'view',
              type: 'function',
            },
          ],
          address: '0xcA11bde05977b3631167028862bE2a173976CA11',
          functionName: 'getEthBalance',
          args: [userAddress],
        })
      } else {
        contracts.push({
          abi: erc20ABI,
          address: tokenAddress,
          functionName: 'balanceOf',
          args: [userAddress],
        })
      }
    }
    const data = await this.multicall({
      chainId,
      contracts: contracts as any,
    })
    const result: Record<string, string> = {}
    for (let i = 0; i < tokenAddresses.length; i++) {
      result[tokenAddresses[i]] = `${data?.[i]?.[0] || '0'}`
    }
    return result
  }

  static async estimateGas({ chainId, from, to, data, value }: { from: string; to: string; data?: string; value?: string; chainId: number }) {
    const provider = await this.getProvider(chainId)
    const res = await provider.estimateGas({
      from,
      to,
      value,
      data,
    })
    return res
  }

  static async getFeeData(chainId: number) {
    const provider = await this.getProvider(chainId)
    const feeData = await provider.getFeeData()
    return feeData
  }

  static async getCarInfo({ address, chainId, id }: { chainId: number; address: `0x${string}`; id: string }) {
    const result1 = await this.multicall({
      chainId,
      contracts: [
        {
          abi: carABI,
          address: AppConfig.carAddress as any,
          functionName: 'getTokenType',
          args: [id as any],
        },
        {
          abi: [
            {
              inputs: [
                {
                  internalType: 'address',
                  name: 'implementation',
                  type: 'address',
                },
                {
                  internalType: 'uint256',
                  name: 'chainId',
                  type: 'uint256',
                },
                {
                  internalType: 'address',
                  name: 'tokenContract',
                  type: 'address',
                },
                {
                  internalType: 'uint256',
                  name: 'tokenId',
                  type: 'uint256',
                },
                {
                  internalType: 'uint256',
                  name: 'salt',
                  type: 'uint256',
                },
              ],
              name: 'account',
              outputs: [
                {
                  internalType: 'address',
                  name: '',
                  type: 'address',
                },
              ],
              stateMutability: 'view',
              type: 'function',
            },
          ] as const,
          address: AppConfig.registryAddress,
          functionName: 'account',
          args: [AppConfig.implementationAddress, chainId as unknown as bigint, address, id as unknown as bigint, BigInt(0)],
        },
      ],
    })
    const result: Record<string, any> = {
      type: result1?.[0]?.[0]?.toString(),
      tbaAddress: result1?.[1]?.[0] || '',
    }

    const result2 = await this.multicall({
      chainId,
      contracts: [
        {
          abi: carABI,
          address: AppConfig.colorAddress,
          functionName: 'tokenOfOwnerByIndex',
          args: [result.tbaAddress, BigInt(0)],
        },
        {
          abi: carABI,
          address: AppConfig.caliperAddress,
          functionName: 'tokenOfOwnerByIndex',
          args: [result.tbaAddress, BigInt(0)],
        },
        {
          abi: carABI,
          address: AppConfig.rimAddress,
          functionName: 'tokenOfOwnerByIndex',
          args: [result.tbaAddress, BigInt(0)],
        },
        {
          abi: carABI,
          address: AppConfig.brakeDiskAddress,
          functionName: 'tokenOfOwnerByIndex',
          args: [result.tbaAddress, BigInt(0)],
        },
        {
          abi: carABI,
          address: AppConfig.windShieldAddress,
          functionName: 'tokenOfOwnerByIndex',
          args: [result.tbaAddress, BigInt(0)],
        },
      ],
    })
    result.nftIdColor = result2?.[0]?.[0]?.toString() || null
    result.nftIdCaliper = result2?.[1]?.[0]?.toString() || null
    result.nftIdRim = result2?.[2]?.[0]?.toString() || null
    result.nftIdBrakeDisk = result2?.[3]?.[0]?.toString() || null
    result.nftIdWindShield = result2?.[4]?.[0]?.toString() || null
    const result3 = await this.multicall({
      chainId,
      contracts: [
        {
          abi: carABI,
          address: AppConfig.colorAddress,
          functionName: 'getTokenType',
          args: [result.nftIdColor || '0'],
        },
        {
          abi: carABI,
          address: AppConfig.caliperAddress,
          functionName: 'getTokenType',
          args: [result.nftIdCaliper || '0'],
        },
        {
          abi: carABI,
          address: AppConfig.rimAddress,
          functionName: 'getTokenType',
          args: [result.nftIdRim || '0'],
        },
        {
          abi: carABI,
          address: AppConfig.brakeDiskAddress,
          functionName: 'getTokenType',
          args: [result.nftIdBrakeDisk || '0'],
        },
        {
          abi: carABI,
          address: AppConfig.windShieldAddress,
          functionName: 'getTokenType',
          args: [result.nftIdWindShield || '0'],
        },
      ],
    })
    result.typeColor = result2?.[0]?.[0]?.toString() || null
    result.typeCaliper = result2?.[1]?.[0]?.toString() || null
    result.typeRim = result2?.[2]?.[0]?.toString() || null
    result.typeBrakeDisk = result2?.[3]?.[0]?.toString() || null
    result.typeWindShield = result2?.[4]?.[0]?.toString() || null
    return result
  }
}
