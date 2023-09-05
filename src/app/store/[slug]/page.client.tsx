'use client'
import { createContext, useState } from 'react'
import { styled } from 'styled-components'
import dynamic from 'next/dynamic'
import Buy from '@/components/Store/Buy'
const BackButton = dynamic(() => import('@/components/UI/Button/Back'))
const Cars = dynamic(() => import('@/components/3D/Cars'))
const License = dynamic(() => import('@/components/Store/License'))
const CarConfig = dynamic(() => import('@/components/Store/CarConfig'))
const Scene = dynamic(() => import('@/components/3D/Scene'))

const Container = styled.main`
  position: relative;
  width: 100vw;
  height: 100vh;
  background-color: #101010;
  display: flex;
  gap: 20px;
`

const SceneContainer = styled.div`
  width: calc(100vw - 470px);
  height: 100%;
`

const Info = styled.div`
  width: 100%;
  max-width: 450px;
  height: 100%;
`

type CarConfig = {
  mainColor?: string
  caliper?: string
  rim?: string
  brakeDisk?: string
  windshield?: string
}

type Step = 'choose-option' | 'buy'

type ContextType = {
  config: CarConfig
  step: Step
  onChangeConfig: (k: string, value: string) => any
  setStep: (k: Step) => any
}

export const CarContext = createContext<ContextType>({
  config: {},
  step: 'choose-option',
  onChangeConfig: () => {},
  setStep: () => {},
})

interface ICar {
  key: string
  name: string
  price: string
  address: string
  type: string
  attribute: {
    key: string
    name: string
    address: string
    options: {
      key: string
      icon?: string
      name: string
      price: string
      type: string
    }[]
  }[]
}

export const Car: Record<string, ICar> = {
  'mc-laren-p1': {
    key: 'mc-laren-p1',
    name: 'MC Laren P1',
    address: '0xXe',
    price: '1000000',
    type: '1',
    attribute: [
      {
        key: 'mainColor',
        address: '0xMainColor',
        name: 'Main Color',
        options: [
          {
            key: 'gray',
            name: 'Gray',
            price: '0',
            type: '1',
            icon: 'gray',
          },
          {
            key: 'white',
            name: 'White',
            price: '0',
            type: '2',
            icon: 'white',
          },
          {
            key: 'black',
            name: 'Black',
            price: '2000',
            type: '3',
            icon: 'black',
          },
          {
            key: 'red',
            name: 'Red',
            price: '2000',
            type: '4',
            icon: 'red',
          },
        ],
      },
      {
        key: 'caliper',
        address: '0xCalipers',
        name: 'Calipers',
        options: [
          {
            key: 'normal',
            name: 'Normal',
            price: '0',
            type: '1',
          },
          {
            key: 'brembo',
            name: 'Brembo',
            price: '5000',
            type: '2',
          },
        ],
      },
      {
        key: 'rim',
        address: '0xRim',
        name: 'Rim',
        options: [
          {
            key: 'normal',
            name: 'Normal',
            price: '0',
            type: '1',
          },
          {
            key: 'white',
            name: 'White',
            price: '2500',
            type: '2',
          },
        ],
      },
      {
        key: 'brakeDisk',
        address: '0xBrakeDisk',
        name: 'Brake Disk',
        options: [
          {
            key: 'castIron',
            name: 'Cast Iron',
            price: '0',
            type: '1',
          },
          {
            key: 'ceramic',
            name: 'Ceramic',
            price: '2000',
            type: '2',
          },
          {
            key: 'carbon',
            name: 'Carbon',
            price: '5000',
            type: '3',
          },
        ],
      },
      {
        key: 'windshield',
        address: '0xWindShield',
        name: 'Wind Shield',
        options: [
          {
            key: 'normal',
            name: 'Normal',
            price: '0',
            type: '1',
          },
          {
            key: 'black',
            name: 'Black',
            price: '1000',
            type: '2',
          },
        ],
      },
    ],
  },
  'porsche-carrare-gt': {
    key: 'porsche-carrare-gt',
    name: 'Porsche Carrare GT',
    address: '0xXe',
    price: '1000000',
    type: '2',
    attribute: [
      {
        key: 'mainColor',
        name: 'Main Color',
        address: '0xMainColor',
        options: [
          {
            key: 'red',
            name: 'Red',
            price: '0',
            type: '1',
            icon: 'red',
          },
          {
            key: 'blue',
            name: 'Blue',
            price: '1000',
            type: '2',
            icon: 'blue',
          },
          {
            key: 'silver',
            name: 'Silver',
            price: '2000',
            type: '3',
            icon: 'silver',
          },
          {
            key: 'gray',
            name: 'Gray',
            price: '2000',
            type: '4',
            icon: 'gray',
          },
          {
            key: 'black',
            name: 'Black',
            price: '2500',
            type: '5',
            icon: 'black',
          },
        ],
      },
      {
        key: 'caliper',
        address: '0xCalipers',
        name: 'Calipers',
        options: [
          {
            key: 'normal',
            name: 'Normal',
            price: '0',
            type: '1',
          },
          {
            key: 'brembo',
            name: 'Brembo',
            price: '5000',
            type: '2',
          },
        ],
      },
      {
        key: 'rim',
        address: '0xRim',
        name: 'Rim',
        options: [
          {
            key: 'normal',
            name: 'Normal',
            price: '0',
            type: '1',
          },
          {
            key: 'chrome',
            name: 'Chrome',
            price: '1500',
            type: '2',
          },
        ],
      },
    ],
  },
}

const StoreDetailClient = ({ slug }: { slug: string }) => {
  const [step, setStep] = useState<Step>('choose-option')
  const [config, setConfig] = useState<CarConfig>({
    mainColor: 'gray',
    caliper: 'normal',
    rim: 'normal',
    brakeDisk: 'castIron',
    windshield: '#f2f2f2',
  })

  const onChangeConfig = (k: string, v: string) => {
    setConfig({ ...config, [k]: v })
  }

  return (
    <CarContext.Provider
      value={{
        config,
        onChangeConfig,
        step,
        setStep,
      }}
    >
      <Container>
        <BackButton />
        <SceneContainer>
          <Scene>
            <Cars slug={slug} />
          </Scene>
        </SceneContainer>
        <Info>
          {step === 'choose-option' && <CarConfig slug={slug} />}
          {step === 'buy' && <Buy slug={slug} />}
        </Info>
        <License slug={slug} />
      </Container>
    </CarContext.Provider>
  )
}

export default StoreDetailClient
