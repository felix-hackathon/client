import { useContext } from 'react'
import { ModalContext } from '.'
import Modal from '@/components/UI/Modal'

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
