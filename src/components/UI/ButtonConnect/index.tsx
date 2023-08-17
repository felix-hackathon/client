import { styled } from 'styled-components'
import PrimaryButton from '../Button/Primary'
import useAuth from '@/hooks/core/useAuth'
import { ellipsisAddress } from '@/common/functions'
import { useCallback, useState } from 'react'
import KaikasService from '@/services/kaikas'

const Container = styled(PrimaryButton)`
  margin-top: -5px;
`
const ButtonConnect = () => {
  const { userAddress, isConnected, isSigned } = useAuth()
  const [isSigning, setIsSigning] = useState(false)

  const handleSign = useCallback(async () => {
    setIsSigning(true)
    await KaikasService.signIn()
    setIsSigning(false)
  }, [])

  const handleClick = useCallback(async () => {
    if (!isConnected || isSigned) {
      await KaikasService.initialize()
    } else {
      handleSign()
    }
  }, [isConnected, isSigned, handleSign])

  return (
    <Container height='40px' loading={isSigning} onClick={handleClick}>
      {isConnected && userAddress ? isSigned ? ellipsisAddress(userAddress) : 'Sign' : <>Wallet Connect</>}
    </Container>
  )
}

export default ButtonConnect
