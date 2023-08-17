import ModalProvider from './modal'
import ModalRenderer from './modal/render'

const UserInterfaceProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ModalProvider>
      {children}
      <ModalRenderer />
    </ModalProvider>
  )
}

export default UserInterfaceProvider
