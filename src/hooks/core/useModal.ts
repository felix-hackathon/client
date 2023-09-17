import { ModalContext } from '@/providers/ui/modal'
import { useContext } from 'react'

const useModal = () => {
  const { close: closeModal, modals, open: openModal, closeAll } = useContext(ModalContext)
  return {
    closeModal,
    openModal,
    modals,
    closeAll,
  }
}
export default useModal
