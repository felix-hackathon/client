'use client'
import NFT from '@/components/NFT'
import AppConfig from '@/config'
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
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 20px;
`

const NoData = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`

const GalleryClient = () => {
  const { nfts } = useNFTs({
    chainId: AppConfig.chainId,
  })

  return (
    <Container>
      <Wrapper>
        <Title>Gallery</Title>
        <ListContainer>{nfts?.length === 0 ? <NoData>No Data</NoData> : nfts?.map((nft: any) => <NFT nft={nft} key={nft._id} />)}</ListContainer>
      </Wrapper>
    </Container>
  )
}

export default GalleryClient
