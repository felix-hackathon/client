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

const GarageClient = () => {
  const { userAddress } = useAuth()
  const { nfts } = useNFTs({
    chainId: AppConfig.chainId,
    owner: userAddress as string,
  })

  console.log(nfts)
  return (
    <Container>
      <Wrapper>
        <Title>My Garage</Title>
        <ListContainer>
          {nfts?.map((nft: any) => (
            <NFTContainer key={nft?._id}>
              <NFTImage src={nft?.image} alt='nft' />
              <NFTName>{nft?.name}</NFTName>
              <NFTId>#{nft?.nftId}</NFTId>
            </NFTContainer>
          ))}
        </ListContainer>
      </Wrapper>
    </Container>
  )
}

export default GarageClient
