'use client'
import BackButton from '@/components/UI/Button/Back'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import { styled } from 'styled-components'
const Scene = dynamic(() => import('@/components/3D/Scene'))
const CarrareGT = dynamic(() => import('@/components/3D/Porsche/CarrareGT'))
const PrimaryButton = dynamic(() => import('@/components/UI/Button/Primary'))

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
  height: 100vh;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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

const OptionsContainer = styled.div`
  margin-top: 15px;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`

const OptionContainer = styled.div<any>`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 200px;
  height: 40px;
  background-color: ${(props) => (props.$active ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)')};
  border-radius: 10px;
  padding: 5px;
  cursor: pointer;
`

const Color = styled.div<any>`
  width: 30px;
  height: 30px;
  border-radius: 10px;
  background-color: ${(props) => props.bg};
`

const OptionValue = styled.p`
  margin: 0px;
  color: #fff;
`

const License = styled.div`
  position: fixed;
  left: 10px;
  top: 50px;
  z-index: 10;
  color: #bdbdbd;
  font-size: 10px;
  width: 100%;
  pointer-events: none;
  div {
    position: absolute;
    bottom: 100%;
    transform: rotateZ(90deg);
    width: calc(100vh - 80px);
    transform-origin: 0 100%;
    white-space: nowrap;
    marquee {
      transform: rotate(180deg);
    }
  }
`

const MainColors = [
  {
    title: 'Red',
    value: 'red',
    price: '0',
  },
  {
    title: 'Blue',
    value: 'blue',
    price: '1000',
  },
  {
    title: 'Silver',
    value: 'silver',
    price: '2000',
  },
  {
    title: 'Gray',
    value: 'gray',
    price: '2000',
  },
  {
    title: 'Black',
    value: 'black',
    price: '2500',
  },
]

const CaliperConfig = [
  {
    title: 'Normal',
    value: 'normal',
    price: '0',
  },
  {
    title: 'Brembo',
    value: 'brembo',
    price: '2000',
  },
]
const RimConfig = [
  {
    title: 'Normal',
    value: 'normal',
    price: '0',
  },
  {
    title: 'Chrome',
    value: 'chrome',
    price: '1000',
  },
]

const PorscheCarrareClient = () => {
  const [carConfig, setCarConfig] = useState({
    mainColor: 'red',
    caliper: 'normal',
    rim: 'normal',
  })

  const onChangeConfig = (k: string, v: string) => {
    setCarConfig({ ...carConfig, [k]: v })
  }

  return (
    <Container>
      <BackButton />
      <SceneContainer>
        <Scene>
          <CarrareGT config={carConfig} />
        </Scene>
      </SceneContainer>
      <InfoContainer>
        <div>
          <Name>Porsche Carrare GT</Name>
          <PriceContainer>
            <Price>2,000,000 KLAY ~ 500,000 USD</Price>
          </PriceContainer>
          <Title>Car options</Title>
          <OptionTitle>Main color:</OptionTitle>
          <OptionsContainer>
            {MainColors.map((i) => (
              <OptionContainer $active={i.value === carConfig.mainColor} key={i.value} onClick={() => onChangeConfig('mainColor', i.value)}>
                <Color bg={i.value} />
                <OptionValue>
                  {i.title} - ${i.price}
                </OptionValue>
              </OptionContainer>
            ))}
          </OptionsContainer>
          <OptionTitle>Calipers:</OptionTitle>
          <OptionsContainer>
            {CaliperConfig.map((i) => (
              <OptionContainer key={i.value} $active={carConfig.caliper === i.value} onClick={() => onChangeConfig('caliper', i.value)}>
                <OptionValue>
                  {i.title} - ${i.price}
                </OptionValue>
              </OptionContainer>
            ))}
          </OptionsContainer>
          <OptionTitle>Rims:</OptionTitle>
          <OptionsContainer>
            {RimConfig.map((i) => (
              <OptionContainer key={i.value} $active={carConfig.rim === i.value} onClick={() => onChangeConfig('rim', i.value)}>
                <OptionValue>
                  {i.title} - ${i.price}
                </OptionValue>
              </OptionContainer>
            ))}
          </OptionsContainer>
        </div>
        <PrimaryButton width='300px' className='MT50 MB20'>
          Buy
        </PrimaryButton>
      </InfoContainer>
      <License>
        <div>
          {/** @ts-ignore */}
          <marquee>
            This work is based on "Porsche Carrera GT 2003 Street"
            (https://sketchfab.com/3d-models/porsche-carrera-gt-2003-street-1880cd019d6f4bc2a8aec8a220bd5f0c) by Pitstop 3D - Euro
            (https://sketchfab.com/carfan100) licensed under CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
            {/** @ts-ignore */}
          </marquee>
        </div>
      </License>
    </Container>
  )
}

export default PorscheCarrareClient
