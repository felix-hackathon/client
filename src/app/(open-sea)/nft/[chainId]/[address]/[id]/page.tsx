import NFTDetailClient from './page.client'

const NFTDetail = ({ params: { address, chainId, id } }: { params: { chainId: string; address: `0x${string}`; id: string } }) => {
  return <NFTDetailClient address={address} chainId={parseInt(chainId)} id={id} />
}

export default NFTDetail
