'use client'
import AppConfig from '@/config'
import useAuth from '@/hooks/core/useAuth'
import useNFTs from '@/hooks/useNFTs'
import { styled } from 'styled-components'

const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`

const Wrapper = styled.div`
  width: 100%;
  max-width: 1330px;
  padding: 0px 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const Title = styled.h1`
  width: 100%;
  font-weight: 500;
  margin-top: 20px;
  font-size: 22px;
`

const ListContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 20px;
`

const NFTContainer = styled.div`
  width: 200px;
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
`

const NFTId = styled.h4`
  padding: 0px 10px 10px 10px;
  font-weight: 400;
  font-size: 12px;
`

const NoData = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`

export const viewNFTInOpensea = (chainId: any, address: string, id: string) => {
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

const GarageClient = () => {
  const { userAddress } = useAuth()
  const { nfts } = useNFTs({
    chainId: AppConfig.chainId,
    owner: userAddress as string,
  })

  return (
    <Container>
      <Wrapper>
        <Title>My Garage</Title>
        <ListContainer>
          {nfts?.length === 0 ? (
            <NoData>No Data</NoData>
          ) : (
            nfts?.map((nft: any) => (
              <a key={nft?._id} href={viewNFTInOpensea(nft?.chainId, nft?.nftAddress, nft?.nftId) as string} target='_blank'>
                <NFTContainer>
                  <NFTImage src={nft?.image} alt='nft' />
                  <NFTName>{nft?.name}</NFTName>
                  <NFTId>#{nft?.nftId}</NFTId>
                </NFTContainer>
              </a>
            ))
          )}
        </ListContainer>
      </Wrapper>
    </Container>
  )
}

export default GarageClient
