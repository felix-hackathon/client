'use client'
import McLarenP1 from '@/components/3D/McLaren/P1'
import Scene from '@/components/3D/Scene'
import BackButton from '@/components/UI/Button/Back'
import PrimaryButton from '@/components/UI/Button/Primary'
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
  width: calc(100vw - 450px);
  height: 100%;
`

const InfoContainer = styled.div`
  width: 430px;
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
  justify-content: space-between;
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

const MainColors = [
  {
    title: 'Gray',
    value: 'gray',
    price: '0',
  },
  {
    title: 'White',
    value: 'white',
    price: '0',
  },
  {
    title: 'Black',
    value: 'black',
    price: '2000',
  },
  {
    title: 'Red',
    value: 'red',
    price: '2000',
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
    price: '5000',
  },
]
const RimConfig = [
  {
    title: 'Black',
    value: 'normal',
    price: '0',
  },
  {
    title: 'White',
    value: 'white',
    price: '2500',
  },
]

const BrakeDiskConfig = [
  {
    title: 'Cast iron',
    value: 'castIron',
    price: '0',
  },
  {
    title: 'Ceramic',
    value: 'ceramic',
    price: '2000',
  },
  {
    title: 'Carbon',
    value: 'carbon',
    price: '5000',
  },
]

const WindshieldConfig = [
  {
    title: 'Normal',
    value: '#f2f2f2',
    price: '0',
  },
  {
    title: 'Black',
    value: 'black',
    price: '1000',
  },
]

const McLarenClient = () => {
  const [carConfig, setCarConfig] = useState({
    mainColor: 'gray',
    caliper: 'normal',
    rim: 'normal',
    brakeDisk: 'castIron',
    windshield: '#f2f2f2',
  })

  const onChangeConfig = (k: string, v: string) => {
    setCarConfig({ ...carConfig, [k]: v })
  }

  return (
    <Container>
      <BackButton />
      <SceneContainer>
        <Scene>
          <McLarenP1 config={carConfig} />
        </Scene>
      </SceneContainer>
      <InfoContainer>
        <div>
          <Name>Mc Laren P1</Name>
          <PriceContainer>
            <Price>500,000 USD</Price>
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
          <OptionTitle>Brake Disk:</OptionTitle>
          <OptionsContainer>
            {BrakeDiskConfig.map((i) => (
              <OptionContainer key={i.value} $active={carConfig.brakeDisk === i.value} onClick={() => onChangeConfig('brakeDisk', i.value)}>
                <OptionValue>
                  {i.title} - ${i.price}
                </OptionValue>
              </OptionContainer>
            ))}
          </OptionsContainer>
          <OptionTitle>Windshield:</OptionTitle>
          <OptionsContainer>
            {WindshieldConfig.map((i) => (
              <OptionContainer key={i.value} $active={carConfig.windshield === i.value} onClick={() => onChangeConfig('windshield', i.value)}>
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
    </Container>
  )
}

export default McLarenClient
