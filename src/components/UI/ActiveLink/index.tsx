import useRouter from '@/hooks/core/useRouter'
import Link, { LinkProps } from 'next/link'
import { useMemo } from 'react'
import { css, styled } from 'styled-components'

const CustomLink = styled(Link)<any>`
  ${(props) =>
    props.$active &&
    css`
      font-weight: 500;
    `}
`

export type ActiveLinkProps = LinkProps & {
  children: React.ReactNode
  activePath?: string[]
}

const ActiveLink = ({ href, children, ...rest }: ActiveLinkProps) => {
  const router = useRouter()
  const active = useMemo(() => {
    return router.pathname === href
  }, [router, href])

  return (
    <CustomLink $active={active} href={`/${router.locale}${href}`} {...rest}>
      {children}
    </CustomLink>
  )
}

export default ActiveLink
