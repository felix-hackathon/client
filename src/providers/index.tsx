'use client'

import { Language } from '@/languages/index'
import ReduxProvider from './Redux'
import StyledComponentsRegistry from './StyledComponentsRegistry'
import Web3Providers from './Web3'
import I18nProvider from './I18nProvider'
import UserInterfaceProvider from './UI'

const Providers = ({ children, language }: { children: React.ReactNode; language: Language }) => {
  return (
    <>
      <ReduxProvider>
        <Web3Providers>
          <StyledComponentsRegistry>
            <UserInterfaceProvider>
              <I18nProvider language={language}>{children}</I18nProvider>
            </UserInterfaceProvider>
          </StyledComponentsRegistry>
        </Web3Providers>
      </ReduxProvider>
    </>
  )
}

export default Providers
