import { styled } from 'styled-components'
import SelectToken from './SelectToken'
const Container = styled.div`
  height: 110px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const Title = styled.h3`
  margin: 0;
  color: #444;
`

const Balance = styled.h5`
  margin: 0;
  color: #777;
`

const InputContainer = styled.div`
  display: flex;
  gap: 20px;
`

const Input = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-size: 28px;
  font-weight: 500;
  color: #828282;
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button,
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  &[type='number'],
  input[type='number'] {
    -moz-appearance: textfield;
  }
  &:disabled {
    cursor: not-allowed;
  }
`

const SwapInput = ({ title, disabled, chainId }: { title: string; disabled?: boolean; chainId: number }) => {
  return (
    <Container>
      <Title>{title}</Title>
      <InputContainer>
        <Input defaultValue={123} disabled={disabled} type='number' />
        <SelectToken chainId={chainId} />
      </InputContainer>
      <Balance>Balance: 0</Balance>
    </Container>
  )
}
export default SwapInput
