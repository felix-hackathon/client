const caches: Map<string, any> = new Map()
export default class CacheService {
  static set(key: string, value: any) {
    try {
      caches.set(key, value)
      return true
    } catch (error) {
      console.error(error)
      return false
    }
  }

  static get(key: string) {
    try {
      const data = caches.get(key)
      if (data) {
        return data
      }
      return null
    } catch (error) {
      console.error(error)
      return null
    }
  }

  static remove(key: string) {
    try {
      return caches.delete(key)
    } catch (error) {
      console.error(error)
      return false
    }
  }

  static removeAll() {
    try {
      caches.clear()
      return true
    } catch (error) {
      console.error(error)
      return false
    }
  }
}
