'use client'
import ReduxProvider from './Redux'
import StyledComponentsRegistry from './StyledComponentsRegistry'
import UserInterfaceProvider from './UI'

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
