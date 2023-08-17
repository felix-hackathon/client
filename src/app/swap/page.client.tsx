'use client'
import SwapSection from '@/components/Swap/Section'
import { styled } from 'styled-components'

const Container = styled.section`
  width: 100%;
  min-height: calc(100% - 60px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

export default function SwapClient({ chainId }: { chainId: number }) {
  return (
    <Container>
      <SwapSection chainId={chainId} />
    </Container>
  )
}
