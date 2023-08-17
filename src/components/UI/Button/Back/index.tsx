import Image from 'next/image'
import { styled } from 'styled-components'
import backIcon from '@/assets/icons/back.svg'
import { useRouter } from 'next/navigation'

const Container = styled.div`
  position: fixed;
  top: 20px;
  left: 15px;
`

export type BackButtonProps = {}

export default function BackButton(props: BackButtonProps) {
  const router = useRouter()
  return (
    <Container onClick={() => router.back()}>
      <Image src={backIcon} alt='back' />
    </Container>
  )
}
