import { encode, decode } from 'msgpack-lite'
import crypto from 'crypto-js'
import CookieService, { CookieKeys } from '../cookie'
import ReduxService from '../redux/service'
import { setUser } from '../redux/slices/user'

export type IFetch = {
  url: string
  baseUrl?: string
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH'
  query?: any
  body?: any
  contentType?: string
  auth?: string | boolean
  throwError?: boolean
} & Omit<RequestInit, 'body' | 'headers'>

const encryptMode = process.env.NEXT_PUBLIC_ENCRYPT as unknown as boolean
const encryptPass = process.env.NEXT_PUBLIC_ENCRYPT_PASS || ''
const apiUri = process.env.NEXT_PUBLIC_API_URI || ''

export const fetcher = async (options: IFetch): Promise<any> => {
  let { url, baseUrl, method = 'GET', query = undefined, body = undefined, contentType = undefined, auth = undefined, throwError = true, ...config } = options
  let callUrl: URL = url?.includes('http') ? new URL(url) : new URL(url, apiUri)
  if (query) {
    Object.keys(query).forEach((key) => {
      const values = Array.isArray(query[key]) ? query[key] : [query[key]]
      values.forEach((v: any) => {
        if (callUrl.searchParams.has(key)) {
          callUrl.searchParams.append(key, v)
        } else {
          callUrl.searchParams.set(key, v)
        }
      })
    })
  }

  const headers = new Headers({
    'from-vinny-with-love': 'true',
  })

  if (contentType) {
    headers.set('content-type', contentType)
  } else {
    headers.set('content-type', encryptMode ? 'application/octet-stream' : 'application/json')
  }

  if (auth) {
    if (typeof auth === 'string') {
      headers.set('Authorization', `Bearer ${auth}`)
    } else {
      const activeUser = (await CookieService.get(CookieKeys.ActiveUser)) || ReduxService.getUser()?.address
      let cookieToken = await CookieService.get<string>(`${CookieKeys.AccessToken}::${activeUser}`)
      if (cookieToken) {
        headers.set('Authorization', `Bearer ${cookieToken}`)
      }
    }
  }

  let fetchInit: RequestInit = {
    headers,
    method,
    ...config,
  }

  if (body) {
    if (headers.get('content-type') === 'application/octet-stream') {
      fetchInit.body = encode(crypto.AES.encrypt(JSON.stringify(body), encryptPass).toString())
    } else {
      fetchInit.body = JSON.stringify(body)
    }
  }

  const resFetch = await fetch(callUrl.href, fetchInit)

  let resJson = null

  if (resFetch.headers.get('content-type') === 'application/octet-stream') {
    const resBytes = await resFetch?.arrayBuffer()
    resJson = JSON.parse(crypto.AES.decrypt(decode(Buffer.from(resBytes)), encryptPass).toString(crypto.enc.Utf8))
  } else {
    resJson = await resFetch.json()
  }

  if (resJson.statusCode === 200) {
    return resJson
  }

  if (resJson.statusCode === 401) {
    const activeUser = (await CookieService.get(CookieKeys.ActiveUser)) || ReduxService.getUser()?.address
    let cookieToken = await CookieService.get<string>(`${CookieKeys.RefreshToken}::${activeUser}`)
    if (cookieToken) {
      return refreshToken(cookieToken)
        .then(() => {
          return fetcher(options)
        })
        .catch((error) => {
          console.log(error)
          if (throwError) {
            throw new Error(error)
          }
          return null
        })
    }
  }
  console.error(resJson)
  if (throwError) {
    throw Error(resJson?.message)
  }
  return null
}

const refreshToken = async (token: string) => {
  const resRefreshToken = await fetcher({
    url: '/authentication/refresh',
    method: 'POST',
    body: {
      refreshToken: token,
    },
  })

  if (resRefreshToken && resRefreshToken.data) {
    const refreshUserData = resRefreshToken?.data
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
    return
  }
}
