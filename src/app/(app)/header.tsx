import Image from 'next/image'
import { css, styled } from 'styled-components'
import Link from 'next/link'
import logo from '@/assets/logo/logo-transparent.png'
import ButtonConnect from '@/components/UI/ButtonConnect'
import ActiveLink from '@/components/UI/ActiveLink'

const Container = styled.header`
  width: 100%;
  height: 60px;
  position: fixed;
  display: flex;
  justify-content: center;
  background-color: #ffffff;
  box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.2);
  z-index: 10;
`

const HeaderMargin = styled.div`
  height: 60px;
`

const Wrapper = styled.div`
  width: 100%;
  max-width: 1330px;
  padding: 0px 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`

const Side = styled.div<any>`
  position: absolute;
  display: flex;
  align-items: center;
  ${(props) =>
    props.$left &&
    css`
      left: 15px;
    `}
  ${(props) =>
    props.$right &&
    css`
      right: 15px;
    `}
`

const LinkContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;
`

const Header = () => {
  return (
    <>
      <Container>
        <Wrapper>
          <Side $left>
            <Link href='/'>
              <Image src={logo} alt='logo' width={100} priority />
            </Link>
          </Side>
          <LinkContainer>
            <ActiveLink href='/'>Marketplace</ActiveLink>
            <ActiveLink href='/'>My Assets</ActiveLink>
          </LinkContainer>
          <Side $right>
            <ButtonConnect />
          </Side>
        </Wrapper>
      </Container>
      <HeaderMargin />
    </>
  )
}

export default Header
