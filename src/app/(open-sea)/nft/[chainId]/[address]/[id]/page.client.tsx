'use client'
import Cars from '@/components/3D/Cars'
import Scene from '@/components/3D/Scene'
import useNFT from '@/hooks/useNFT'
import { styled } from 'styled-components'

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
`

const Wrapper = styled.div`
  height: 100%;
  max-height: 100vw;
  aspect-ratio: 1;
  background-color: #f2f2f2;
  position: relative;
`

const NFTDetailClient = ({ address, chainId, id }: { chainId: number; address: `0x${string}`; id: string }) => {
  const {} = useNFT({
    address,
    chainId,
    id,
  })
  return (
    <Container>
      <Wrapper>
        <Scene>
          <Cars
            slug='mc-laren-p1'
            config={{
              mainColor: 'gray',
              caliper: 'normal',
              rim: 'normal',
              brakeDisk: 'castIron',
              windshield: '#f2f2f2',
            }}
          />
        </Scene>
      </Wrapper>
    </Container>
  )
}

export default NFTDetailClient
