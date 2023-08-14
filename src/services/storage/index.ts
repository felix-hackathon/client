const prefix = 'client'
export default class LocalStorageService {
  static getKey(key: string) {
    return `${prefix}::${key}`
  }

  static set(key: string, data: any) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.getKey(key), JSON.stringify(data))
      return true
    }
    return false
  }

  static get(key: string) {
    try {
      if (typeof window !== 'undefined') {
        const value = localStorage.getItem(this.getKey(key))
        if (value) {
          return JSON.parse(value)
        }
      }
      return null
    } catch (error) {
      console.error(error)
      return null
    }
  }

  static remove(key: string) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.getKey(key))
      return true
    }
    return false
  }

  static removeAll() {
    if (typeof window !== 'undefined') {
      localStorage.clear()
      return true
    }
    return false
  }
}
