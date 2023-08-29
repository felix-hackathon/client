'use client'
import { createContext, useState } from 'react'
import { styled } from 'styled-components'
import dynamic from 'next/dynamic'
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

const Config = styled.div`
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

type ContextType = {
  config: CarConfig
  onChangeConfig: (k: string, value: string) => any
}
export const CarContext = createContext<ContextType>({
  config: {},
  onChangeConfig: () => {},
})

const StoreDetailClient = ({ slug }: { slug: string }) => {
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
      }}
    >
      <Container>
        <BackButton />
        <SceneContainer>
          <Scene>
            <Cars slug={slug} />
          </Scene>
        </SceneContainer>
        <Config>
          <CarConfig slug={slug} />
        </Config>
        <License slug={slug} />
      </Container>
    </CarContext.Provider>
  )
}

export default StoreDetailClient
