'use client'
import ReduxProvider from './redux'
import StyledComponentsRegistry from './styled-components-registry'
import UserInterfaceProvider from './ui'

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <ReduxProvider>
        {/* <Web3Providers> */}
        <StyledComponentsRegistry>
          <UserInterfaceProvider>{children}</UserInterfaceProvider>
        </StyledComponentsRegistry>
        {/* </Web3Providers> */}
      </ReduxProvider>
    </>
  )
}

export default Providers
