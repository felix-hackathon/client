import Image from 'next/image'
import { styled } from 'styled-components'
import PrimaryButton from '../Button/Primary'
import useAuth from '@/hooks/core/useAuth'
import { ellipsisAddress } from '@/common/functions'
import { useWeb3Modal } from '@web3modal/react'
import { useCallback } from 'react'

const Container = styled(PrimaryButton)`
  margin-top: -5px;
`
const ButtonConnect = () => {
  const { open } = useWeb3Modal()
  const { account, handleSign, isConnected, isSigned, isSigning } = useAuth()
  const handleClick = useCallback(() => {
    if (!isConnected || isSigned) {
      open()
    } else {
      handleSign()
    }
  }, [isConnected, isSigned, open, handleSign])

  return (
    <Container height='40px' loading={isSigning} onClick={handleClick}>
      {isConnected && account ? isSigned ? ellipsisAddress(account) : 'Sign' : <>Wallet Connect</>}
    </Container>
  )
}

export default ButtonConnect
