import useModal from '@/hooks/core/useModal'
import { IModal } from '@/providers/ui/modal'
import { styled } from 'styled-components'

const Container = styled.div`
  position: fixed;
  z-index: 100;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
`

const Mask = styled.div<any>`
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  background-color: ${(props) => (props.$bg ? 'rgba(0, 0, 0, 0.8)' : 'transparent')};
  display: flex;
  justify-content: center;
  align-items: center;
`

const Wrapper = styled.div``

const Modal = ({ modal, $bg }: { modal: IModal; $bg: boolean }) => {
  const { closeModal } = useModal()
  return (
    <Container>
      <Mask $bg={$bg} onClick={() => modal.closeable && closeModal()}>
        <Wrapper onClick={(e) => e.stopPropagation()}>{modal.children}</Wrapper>
      </Mask>
    </Container>
  )
}

export default Modal
