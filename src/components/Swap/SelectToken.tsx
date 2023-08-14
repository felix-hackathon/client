import { styled } from 'styled-components'
import selectIcon from '@/assets/icons/select.svg'
import errorToken from '@/assets/icons/tokens/error-token.svg'
import Image from 'next/image'
import useModal from '@/hooks/core/useModal'
import SelectTokenModal from './SelectTokenModal'

const Container = styled.div`
  width: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
`
const SelectToken = ({ chainId }: { chainId: number }) => {
  const { openModal } = useModal()
  return (
    <Container
      onClick={(e) => {
        openModal({
          id: 'select-token-modal',
          children: <SelectTokenModal chainId={chainId} value='0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee' />,
        })
      }}
    >
      <Image src={selectIcon} alt='select-icon' width={12} height={12} />
      <Image src={errorToken} alt='token' width={30} height={30} />
    </Container>
  )
}

export default SelectToken
