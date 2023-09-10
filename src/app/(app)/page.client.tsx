'use client'
import { styled } from 'styled-components'
import Image from 'next/image'
import carrera from '@/assets/images/porsche-carrera-gt.jpeg'
import mcLaren from '@/assets/images/mc-laren.jpeg'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'
import PrimaryButton from '@/components/UI/Button/Primary'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
const Container = styled.main`
  width: 100%;
  height: calc(100% - 60px);
`
const ItemContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`

const Title = styled.h1`
  margin: 0;
  font-size: 48px;
  position: absolute;
  color: #333;
  text-shadow: 2px 0 #e0e0e0, -2px 0 #e0e0e0, 0 2px #e0e0e0, 0 -2px #e0e0e0, 1px 1px #e0e0e0, -1px -1px #e0e0e0, 1px -1px #e0e0e0, -1px 1px #e0e0e0;
`

const ButtonContainer = styled.div`
  position: absolute;
`
export default function HomeClient() {
  const router = useRouter()

  useEffect(() => {
    router.prefetch(`/store/porsche-carrare-gt`)
    router.prefetch(`/store/mc-laren-p1`)
  }, [router])

  return (
    <Container>
      <Swiper autoplay speed={1000} style={{ width: '100%', height: '100%' }} modules={[Autoplay]} loop>
        <SwiperSlide>
          <ItemContainer>
            <Image src={carrera} alt='banner' fill style={{ objectFit: 'cover' }} />
            <Title style={{ top: '10%', left: '10%' }}>Porsche Carrare GT</Title>
            <ButtonContainer style={{ top: '20%', left: '10%' }}>
              <PrimaryButton onClick={() => router.push('/store/porsche-carrare-gt')}>Discover now</PrimaryButton>
            </ButtonContainer>
          </ItemContainer>
        </SwiperSlide>
        <SwiperSlide>
          <ItemContainer>
            <Image src={mcLaren} alt='banner' fill style={{ objectFit: 'cover' }} />
            <Title style={{ bottom: '20%', left: '10%' }}>MC Laren P1</Title>
            <ButtonContainer style={{ bottom: '10%', left: '10%' }}>
              <PrimaryButton onClick={() => router.push('/store/mc-laren-p1')}>Discover now</PrimaryButton>
            </ButtonContainer>
          </ItemContainer>
        </SwiperSlide>
      </Swiper>
    </Container>
  )
}
