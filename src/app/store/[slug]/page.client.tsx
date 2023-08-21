'use client'

import CarrareGT from '@/components/3D/Porsche/CarrareGT'
import Scene from '@/components/3D/Scene'
import BackButton from '@/components/UI/Button/Back'
import { useState } from 'react'
import { styled } from 'styled-components'

const Container = styled.main`
  position: relative;
  width: 100vw;
  height: 100vh;
  background-color: #101010;
  display: flex;
  gap: 20px;
`

const SceneContainer = styled.div`
  width: calc(100vw - 520px);
  height: 100%;
`

const InfoContainer = styled.div`
  width: 500px;
  padding: 30px 10px;
`

const Name = styled.h1`
  color: #fff;
  letter-spacing: 0.2rem;
`

const PriceContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 20px;
`

const Price = styled.p`
  margin: 0;
  font-size: 28px;
  color: #fff;
`

const Title = styled.h2`
  margin: 0;
  margin-top: 50px;
  color: #fff;
  font-weight: 400;
`

const OptionTitle = styled.h4`
  margin: 0;
  margin-top: 20px;
  color: #fff;
  font-weight: 400;
`

const ColorOptionsContainer = styled.div`
  margin-top: 15px;
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
`

const ColorOptionContainer = styled.div<any>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  cursor: pointer;
`

const ColorTitle = styled.p<any>`
  margin: 0;
  color: ${(props) => (props.$active ? '#fff' : '#c9c9c9')};
`

const ColorPrice = styled.p`
  margin: 0;
  font-weight: 400;
  color: #f2f2f2;
`

const Color = styled.div<any>`
  width: 30px;
  aspect-ratio: 1;
  border-radius: 50%;
  border: 2px solid ${(props) => (props.$active ? '#fff' : '#c9c9c9')};
  background-color: ${(props) => props.color};
`

const StoreDetailClient = () => {
  const [mainColor, setMainColor] = useState('red')
  return (
    <Container>
      <BackButton />
      <SceneContainer>
        <Scene>
          <CarrareGT mainColor={mainColor} />
        </Scene>
      </SceneContainer>
      <InfoContainer>
        <Name>Porsche Carrare GT</Name>
        <PriceContainer>
          <Price>2,000,000 KLAY ~ 500,000 USD</Price>
        </PriceContainer>
        <Title>Car options</Title>
        <OptionTitle>Main color:</OptionTitle>
        <ColorOptionsContainer>
          <ColorOptionContainer onClick={() => setMainColor('red')}>
            <Color color='red' $active={mainColor === 'red'} />
            <ColorTitle $active={mainColor === 'red'}>Red</ColorTitle>
            <ColorPrice>$0</ColorPrice>
          </ColorOptionContainer>
          <ColorOptionContainer onClick={() => setMainColor('green')}>
            <Color color='green' $active={mainColor === 'green'} />
            <ColorTitle $active={mainColor === 'green'}>Green</ColorTitle>
            <ColorPrice>$100</ColorPrice>
          </ColorOptionContainer>
        </ColorOptionsContainer>
      </InfoContainer>
    </Container>
  )
}

export default StoreDetailClient
