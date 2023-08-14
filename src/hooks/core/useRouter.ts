import { NavigateOptions, PrefetchOptions } from 'next/dist/shared/lib/app-router-context'
import { useRouter as useNextRouter, usePathname } from 'next/navigation'
import { useCallback, useMemo } from 'react'

const useRouter = () => {
  const path = usePathname()
  const { back, forward, prefetch: prefetchNext, push: pushNext, refresh, replace: replaceNext } = useNextRouter()

  const localePath = useMemo(() => path.split('/')?.[1], [path])

  const pathname = useMemo(() => {
    if (path.lastIndexOf('/') === 0) return '/'
    return path.split(`/${localePath}`).join('')
  }, [path, localePath])

  const prefetch = useCallback(
    (href: string, options?: PrefetchOptions) => {
      return prefetchNext(`/${localePath}${href}`, options)
    },
    [prefetchNext, localePath]
  )

  const push = useCallback(
    (href: string, options?: NavigateOptions) => {
      return pushNext(`/${localePath}${href}`, options)
    },
    [pushNext, localePath]
  )

  const replace = useCallback(
    (href: string, options?: NavigateOptions) => {
      return replaceNext(`/${localePath}${href}`, options)
    },
    [replaceNext, localePath]
  )

  return {
    pathname,
    locale: localePath,
    back,
    forward,
    prefetch,
    refresh,
    push,
    replace,
  }
}

export default useRouter
