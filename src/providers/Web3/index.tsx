import { Dispatch, SetStateAction, createContext, useState } from 'react'
import { chainsSupported } from '@/common/constants/chains'
import useChainConnected from '@/hooks/core/useChainConnected'
import useWatchNetwork from '@/hooks/core/useWatchNetwork'
import useWeb3Connect from '@/hooks/core/useWeb3Connect'
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/react'
import { WagmiConfig, configureChains, createConfig, useAccount } from 'wagmi'

const projectId = process.env.NEXT_PUBLIC_WALLET_PROJECT_ID as unknown as string

const { publicClient } = configureChains(chainsSupported, [w3mProvider({ projectId })])
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [...w3mConnectors({ projectId, chains: chainsSupported })],
  publicClient,
})
const ethereumClient = new EthereumClient(wagmiConfig, chainsSupported)

const defaultValue: [boolean, Dispatch<SetStateAction<boolean>>] = [false, () => {}]

export const Web3Context = createContext(defaultValue)

const WithWeb3 = ({ children }: any) => {
  useWeb3Connect()
  useWatchNetwork()

  const [isSigning, setIsSigning] = useState(false)

  return <Web3Context.Provider value={[isSigning, setIsSigning]}>{children}</Web3Context.Provider>
}

const Web3Providers = ({ children }: { children: React.ReactNode }) => {
  const { chain } = useChainConnected()
  return (
    <>
      <WagmiConfig config={wagmiConfig}>
        <WithWeb3>{children}</WithWeb3>
      </WagmiConfig>
      <Web3Modal
        themeVariables={{
          '--w3m-accent-color': '#888',
          '--w3m-accent-fill-color': '#fff',
          '--w3m-background-color': '#555',
          '--w3m-container-border-radius': '0px',
          '--w3m-background-border-radius': '0px',
        }}
        projectId={projectId}
        defaultChain={chain}
        ethereumClient={ethereumClient}
      />
    </>
  )
}

export default Web3Providers
