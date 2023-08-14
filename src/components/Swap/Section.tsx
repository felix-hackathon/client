import { styled } from 'styled-components'
import SwapCard from './Card'

const Container = styled.div`
  width: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  padding: 10px 100px;
  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 10px;
    top: 50%;
    transform: translate(0, -50%);
    z-index: 0;
    background-color: #444;
  }
`

const SwapSection = ({ chainId }: { chainId: number }) => {
  return (
    <Container>
      <SwapCard chainId={chainId} />
    </Container>
  )
}

export default SwapSection
