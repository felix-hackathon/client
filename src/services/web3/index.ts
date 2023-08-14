import { Contract, Interface, Network, ethers } from 'ethers'
import ConfigService from '../config'
import { erc20ABI } from 'wagmi'
import { ContractFunctionConfig, MulticallContracts, Narrow, multicall3Abi } from 'viem'
import { multicall } from '@wagmi/core'

multicall
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
    return new Contract(address || defaultMulticallAddress, multicall3Abi, provider)
  }
  static async createERC20Contract(chainId: number, address: string) {
    const provider = await this.getProvider(chainId)
    return new Contract(address, erc20ABI, provider)
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
          allowFailure: true,
          callData: iface.encodeFunctionData(currentContract.functionName, currentContract.args || []),
        }
      })
      const res = await contract.aggregate3.staticCall(callsData)
      const resultsDecoded = res.map(({ success, returnData }: any, i: number) => {
        if (!success) return null
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
    console.log(results)
  }
}
