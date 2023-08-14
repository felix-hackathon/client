import { ModalContext } from '@/providers/UI/Modal'
import { useContext } from 'react'

const useModal = () => {
  const { close: closeModal, modals, open: openModal } = useContext(ModalContext)
  return {
    closeModal,
    openModal,
    modals,
  }
}
export default useModal
