import Image from 'next/image'
import viewTBAIcon from '@/assets/icons/garage.svg'
import { styled } from 'styled-components'
import { useState } from 'react'
import Content from './Content'

const ButtonContainer = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  width: 40px;
  aspect-ratio: 1;
  border-radius: 50%;
  background-color: #f2f2f2;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(0px) scale(1.1);
  }
`

const Container = styled.div`
  position: absolute;
  bottom: 0px;
  left: 0px;
  right: 0px;
  top: 0px;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: flex-end;
  cursor: pointer;
  z-index: 10;
`

const TBA = ({ data }: { data: any }) => {
  const [open, setOpen] = useState(false)

  if (!open) {
    return (
      <ButtonContainer onClick={() => setOpen(true)}>
        <Image src={viewTBAIcon} alt='view-tba' width={20} height={20} />
      </ButtonContainer>
    )
  }
  return (
    <Container
      onClick={() => {
        setOpen(false)
      }}
    >
      <Content onClose={() => setOpen(false)} data={data} />
    </Container>
  )
}

export default TBA
