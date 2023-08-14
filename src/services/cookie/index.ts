import { deleteCookie, getCookie, setCookie, hasCookie, getCookies } from 'cookies-next'

export enum CookieKeys {
  AccessToken = 'accessToken',
  RefreshToken = 'refreshToken',
  ActiveUser = 'activeUser',
}

export const YEAR = 31536000

export default class CookieService {
  static async has(key: string) {
    try {
      if (typeof window === 'undefined') {
        const nextCookie = (await import('next/headers')).cookies()
        return nextCookie.has(key)
      } else {
        return hasCookie(key)
      }
    } catch (error) {
      console.error(error)
      return false
    }
  }

  static async getAllKeys(includesKeys?: string | string[]) {
    try {
      let allKeys = []
      if (typeof window === 'undefined') {
        const nextCookie = (await import('next/headers')).cookies()
        allKeys = nextCookie.getAll().map((item) => item.name)
      } else {
        allKeys = Object.keys(getCookies())
      }
      if (includesKeys) {
        if (typeof includesKeys === 'string') {
          allKeys = allKeys.filter((key) => key.includes(includesKeys))
        } else {
          allKeys = allKeys.filter((key) => includesKeys.map((x) => key.includes(x)).includes(true))
        }
      }
      return allKeys
    } catch (error) {
      console.error(error)
      return []
    }
  }

  static async get<T>(key: string): Promise<T | null> {
    try {
      let data: string | null = null
      if (typeof window === 'undefined') {
        const nextCookie = (await import('next/headers')).cookies()
        data = nextCookie.get(key)?.value || null
      } else {
        data = getCookie(key)?.toString() || null
      }
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error(error)
      return null
    }
  }

  static async set(key: string, value: any) {
    try {
      if (typeof window === 'undefined') {
        const nextCookie = (await import('next/headers')).cookies()
        nextCookie.set(key, JSON.stringify(value), {
          maxAge: YEAR,
        })
      } else {
        setCookie(key, JSON.stringify(value), {
          maxAge: YEAR,
        })
      }
      return true
    } catch (error) {
      console.error(error)
      return false
    }
  }

  static async remove(key: string | string[]) {
    try {
      if (typeof window === 'undefined') {
        const nextCookie = (await import('next/headers')).cookies()
        if (typeof key === 'string') {
          nextCookie.delete(key)
        } else {
          key.forEach((k) => {
            nextCookie.delete(k)
          })
        }
      } else {
        if (typeof key === 'string') {
          deleteCookie(key)
        } else {
          key.forEach((k) => {
            deleteCookie(k)
          })
        }
      }
      return true
    } catch (error) {
      console.error(error)
      return false
    }
  }
}
