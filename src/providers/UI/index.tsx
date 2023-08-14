import ModalProvider from './Modal'
import ModalRenderer from './Modal/render'

const UserInterfaceProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ModalProvider>
      {children}
      <ModalRenderer />
    </ModalProvider>
  )
}

export default UserInterfaceProvider
