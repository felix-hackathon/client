import { useContext } from 'react'
import Modal from '@/components/UI/Modal'
import { ModalContext } from '.'

const ModalRenderer = () => {
  const configs = useContext(ModalContext)
  return (
    <>
      {configs.modals.map((modal) => (
        <Modal key={modal.id} modal={modal} />
      ))}
    </>
  )
}

export default ModalRenderer
