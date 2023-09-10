import useModal from '@/hooks/core/useModal'
import useToken from '@/hooks/useToken'
import { styled } from 'styled-components'
import SelectTokenModal from './Modal'

const Container = styled.div`
  width: Min(150px, 'fit-content');
  height: 40px;
  background-color: #000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 5px 10px 10px;
  cursor: pointer;
`

const Icon = styled.img``

const TokenContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

const TokenIcon = styled.img`
  width: 20px;
`

const TokenSymbol = styled.div`
  color: #fff;
`
const SelectToken = ({ value, onChange, chainId }: { value: string; onChange?: (v: string) => any; chainId: number }) => {
  const { openModal } = useModal()
  const { token } = useToken({
    chainId,
    address: value,
  })
  return (
    <Container
      onClick={() => {
        openModal({
          id: 'select-token',
          children: <SelectTokenModal value={value} onChange={onChange} chainId={chainId} />,
        })
      }}
    >
      <TokenContainer>
        <TokenIcon src={token?.icon} />
        <TokenSymbol>{token?.symbol}</TokenSymbol>
      </TokenContainer>
      <Icon src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAI1JREFUSEvtk1EOgCAMQ9ub4cnkZnKzmiWaEGUMP4x+wCeMtnsM4uXFl/UxDULCE9HPEUlKJEsvpqRMMns17iPbRQArgEJyaQlI2gAkAIsXpDtFlcDNpHdWhwnHtCU0Km5GoYEV1YJHOsPionvUwVlcmdjWkPhwBxcTeI/eGoQhROFv6hRMg5DeRPQ9oh2q8zUZwVlLDQAAAABJRU5ErkJggg==' />
    </Container>
  )
}

export default SelectToken
