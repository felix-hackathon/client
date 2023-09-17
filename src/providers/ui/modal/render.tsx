import { useContext } from 'react'
import Modal from '@/components/UI/Modal'
import { ModalContext } from '.'

const ModalRenderer = () => {
  const configs = useContext(ModalContext)
  return (
    <>
      {configs.modals.map((modal, index) => (
        <Modal key={modal.id} modal={modal} $bg={index === configs.modals.length - 1} />
      ))}
    </>
  )
}

export default ModalRenderer
