import { fetcher } from '../api'
import CacheService from '../cache'

export default class ConfigService {
  static async getConfig(withCache = true) {
    const key = 'app-config'
    if (withCache) {
      const data = CacheService.get(key)
      if (data) {
        return data
      }
    }
    const res = await fetcher({
      url: '/app/config',
      throwError: false,
    })
    if (res?.data) {
      CacheService.set(key, res?.data)
      return res?.data
    }
    return null
  }

  static async getChain(chainId: number, withCache = true) {
    const config = await this.getConfig(withCache)
    if (!config?.chains) {
      return null
    }
    return config.chains.find((c: any) => c.chainId === chainId) || null
  }

  static async getRPC(chainId: number, withCache = true) {
    const key = `rpc::${chainId}`
    if (withCache) {
      const data = CacheService.get(key)
      if (data) {
        return data
      }
    }
    const chain = await this.getChain(chainId, withCache)
    if (!chain) {
      return null
    }
    const rpc = chain?.rpc?.[0]
    if (rpc) {
      CacheService.set(key, rpc)
      return rpc
    }
    return null
  }
}
