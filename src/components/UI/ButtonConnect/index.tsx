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
  const [loading, setLoading] = useState(false)

  const handleClick = useCallback(async () => {
    setLoading(true)
    if (!isConnected) {
      await KaikasService.initialize()
    } else if (isSigned) {
      await KaikasService.disconnect()
    } else {
      await KaikasService.signIn()
    }
    setLoading(false)
  }, [isConnected, isSigned])

  return (
    <Container height='40px' loading={loading} onClick={handleClick}>
      {isConnected && userAddress ? isSigned ? ellipsisAddress(userAddress) : 'Sign' : <>Wallet Connect</>}
    </Container>
  )
}

export default ButtonConnect
