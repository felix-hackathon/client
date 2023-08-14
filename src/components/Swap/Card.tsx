import { styled } from 'styled-components'
import SwapInput from './Input'
import arrowDown from '@/assets/icons/arrow-down.svg'
import Image from 'next/image'

const Container = styled.div`
  z-index: 1;
  width: 100%;
  max-width: 700px;
  transform: skewX(-4deg);
  box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.3);
  display: flex;
`

const SwapInputContainer = styled.div`
  flex: 1;
  height: 300px;
  padding: 10px 30px 10px 15px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const SwapButton = styled.div`
  width: 150px;
  padding: 10px;
  background-color: #444;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  font-size: 24px;
  color: #fff;
  cursor: pointer;
  user-select: none;
  &:active {
    background-color: #666;
  }
`

const SwapIcon = styled.div`
  width: 30px;
  display: flex;
  justify-content: center;
  align-self: flex-end;
  align-items: center;
  aspect-ratio: 1;
  border-radius: 50%;
  background-color: #444;
  transition: 1s ease;
  cursor: pointer;
  &:hover {
    transform: rotate(180deg);
  }
`

const SwapCard = ({ chainId }: { chainId: number }) => {
  return (
    <Container>
      <SwapInputContainer>
        <SwapInput chainId={chainId} title='From' />
        <SwapIcon>
          <Image src={arrowDown} alt='icon-swap' />
        </SwapIcon>
        <SwapInput chainId={chainId} disabled title='To' />
      </SwapInputContainer>
      <SwapButton>Swap</SwapButton>
    </Container>
  )
}

export default SwapCard
