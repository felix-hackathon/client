import Link, { LinkProps } from 'next/link'
import { usePathname } from 'next/navigation'
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
  const pathname = usePathname()
  const active = useMemo(() => {
    return pathname === href
  }, [pathname, href])

  return (
    <CustomLink $active={active} href={href} {...rest}>
      {children}
    </CustomLink>
  )
}

export default ActiveLink
