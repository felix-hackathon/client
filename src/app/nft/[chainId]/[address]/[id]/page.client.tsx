'use client'
import { ellipsisAddress } from '@/common/functions'
import SelectToken from '@/components/NFT/SelectToken'
import PrimaryButton from '@/components/UI/Button/Primary'
import Image from 'next/image'
import { styled } from 'styled-components'

const Container = styled.section`
  min-height: calc(100% - 60px);
  display: flex;
  align-items: center;
  justify-content: center;
`

const Wrapper = styled.div`
  width: 100%;
  padding: 30px 15px;
  max-width: 1030px;
  display: flex;
  gap: 40px;
`

const SummaryContainer = styled.div`
  flex: 3 0 0%;
  max-width: 50%;
  min-width: 40%;
`

const MainContainer = styled.div`
  flex: 4 0 0%;
`

const NFTImageContainer = styled.div`
  width: 100%;
  aspect-ratio: 1;
  position: relative;
`

const NFTName = styled.h1`
  margin: 0;
  letter-spacing: 0.3rem;
  font-weight: 400;
`

const NFTID = styled.h2`
  margin: 0;
  margin-top: 10px;
  letter-spacing: 0.1rem;
  font-weight: 500;
`

const Owner = styled.p`
  margin: 0;
  margin-top: 10px;
  letter-spacing: 0.1 rem;
  font-weight: 500;
`

const PriceContainer = styled.div`
  margin-top: 15px;
  border-radius: 10px;
  border: 1px solid #c9c9c9;
  padding: 15px;
`

const FieldTitle = styled.h5`
  margin: 0;
  font-weight: 500;
  letter-spacing: 0.1rem;
  display: flex;
  align-items: center;
`

const PriceWrapper = styled.div`
  display: flex;
  align-items: flex-end;
`

const PriceValue = styled.p`
  margin: 0;
  font-weight: 700;
  font-size: 22px;
  letter-spacing: 0.1rem;
`

const USDPrice = styled.p`
  margin: 0;
  color: #7e7e7e;
  font-size: 14px;
  margin-left: 2px;
  margin-bottom: 2px;
  font-weight: 500;
`

const NFTClient = ({ nft }: { nft: any }) => {
  return (
    <Container>
      <Wrapper>
        <SummaryContainer>
          <NFTImageContainer>
            <Image
              src={nft.image}
              alt='nft-image'
              fill
              style={{
                objectFit: 'contain',
              }}
            />
          </NFTImageContainer>
        </SummaryContainer>
        <MainContainer>
          <NFTName>{nft.name}</NFTName>
          <NFTID>#{nft.nftId}</NFTID>
          <Owner>Owned by {ellipsisAddress(nft.owner, 4, 4)}</Owner>
          <PriceContainer>
            <FieldTitle>Price</FieldTitle>
            <PriceWrapper>
              <PriceValue>4.7 ETH</PriceValue>
              <USDPrice>$67</USDPrice>
            </PriceWrapper>
            <FieldTitle className='MT10'>Payment Currency</FieldTitle>
            <SelectToken />
            <FieldTitle className='MT10'>Require amount</FieldTitle>
            <PriceValue className='MT10'>4.7 ETH</PriceValue>
            <PrimaryButton className='MT20' height='40px'>
              Buy
            </PrimaryButton>
          </PriceContainer>
        </MainContainer>
      </Wrapper>
    </Container>
  )
}

export default NFTClient
