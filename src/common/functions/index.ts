export const randomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function trimSlash(s: string) {
  return s.replace(/^\/|\/$/g, '')
}

export const ellipsisAddress = (address: string, prefixLength = 4, suffixLength = 4) => {
  address = address || ''
  return `${address.substr(0, prefixLength)}...${address.substr(address?.length - suffixLength, suffixLength)}`
}

export const promiseAll = async (promise: any[]) => {
  return await Promise.all(promise)
}

export const sleep = async (ms: number) => new Promise((res) => setTimeout(res, ms))
