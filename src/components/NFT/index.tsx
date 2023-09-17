import { styled } from 'styled-components'
import NFTDetailModal from '../NFTDetailModal'
import useModal from '@/hooks/core/useModal'
import useAuth from '@/hooks/core/useAuth'
import { useMemo } from 'react'

const NFTContainer = styled.div`
  width: calc(100% / 5 - (20px * 4 / 5));
  position: relative;
  border-radius: 10px;
  background-color: #fff;
`

const NFTImage = styled.img`
  width: 100%;
  border-radius: 10px;
`

const NFTName = styled.h3`
  padding: 0px 10px;
  font-weight: 400;
  font-size: 14px;
  &:hover {
    color: #0000ee;
  }
`

const NFTId = styled.h4`
  padding: 0px 10px 10px 10px;
  font-weight: 400;
  font-size: 12px;
`

const Price = styled.h4`
  height: 30px;
  padding: 0px 10px 10px 10px;
  font-weight: 600;
  font-size: 14px;
`

const viewNFTInOpensea = (chainId: any, address: string, id: string) => {
  const OPENSEA_CHAIN: { [k: string]: string } = {
    1: 'ethereum',
    5: 'goerli',
    56: 'bsc',
    97: 'bsc-testnet',
    137: 'matic',
    8217: 'klaytn',
    1001: 'baobab',
    80001: 'mumbai',
    42161: 'arbitrum',
    421613: 'arbitrum-goerli',
    43114: 'avalanche',
    43113: 'avalanche-fuji',
  }
  if ([5, 97, 80001, 43113, 1001, 421613].includes(parseInt(chainId))) {
    return `https://testnets.opensea.io/assets/${OPENSEA_CHAIN[chainId]}/${address}/${id}`
    return
  }
  return `https://opensea.io/assets/${OPENSEA_CHAIN[chainId]}/${address}/${id}`
}

const NFT = ({ nft }: { nft: any }) => {
  const { openModal } = useModal()
  const { userAddress } = useAuth()
  const fromOffer = useMemo(() => {
    return nft.offer?.find((i: any) => i.buyerAddress === userAddress?.toLowerCase())
  }, [nft, userAddress])

  return (
    <NFTContainer
      onClick={() =>
        openModal({
          children: <NFTDetailModal nft={nft} />,
          id: 'nft-detail',
        })
      }
      key={nft?._id}
    >
      <NFTImage src={nft?.image} alt='nft' />
      <Price>
        {nft?.market?.price && `Price: ${nft?.market?.price} KLAY`}
        {fromOffer && `Your offer ${fromOffer.price} KLAY`}
        {nft?.owner === userAddress?.toLowerCase() && nft?.offer?.length > 0 && `Has ${nft?.offer?.length} offer`}
      </Price>
      <a onClick={(e) => e.stopPropagation()} href={viewNFTInOpensea(nft?.chainId, nft?.nftAddress, nft?.nftId) as string} target='_blank'>
        <NFTName>{nft?.name}</NFTName>
      </a>
      <NFTId>#{nft?.nftId}</NFTId>
    </NFTContainer>
  )
}

export default NFT
