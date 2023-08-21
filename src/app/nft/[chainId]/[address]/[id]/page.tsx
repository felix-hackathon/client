import NFTClient from './page.client'

const NFT = ({ params: { address, chainId, id } }: { params: { chainId: string; address: string; id: string } }) => {
  const nft = {
    image: 'https://i.seadn.io/gcs/files/d76816a4b7325cfc1f367e7879965dc9.png?auto=format&dpr=1&w=1000',
    nftId: id,
    name: 'Mutant Ape Yacht Club',
    owner: '0x60e4d786628fea6478f785a6d7e704777c86a7c6',
    nftAddress: address,
    chainId: parseInt(chainId),
  }
  return <NFTClient nft={nft} />
}

export default NFT
