import Image from 'next/image'
import { styled } from 'styled-components'
import closeIcon from '@/assets/icons/close.svg'
import useModal from '@/hooks/core/useModal'
import PrimaryButton from '../UI/Button/Primary'
import useAuth from '@/hooks/core/useAuth'
import SellModal from '../SellModal'

const Container = styled.div`
  width: 380px;
  padding: 10px;
  background-color: #fff;
`

const Header = styled.div`
  display: flex;
  padding: 5px 0px 10px 0px;
  justify-content: space-between;
  align-items: center;
`

const HeaderTitle = styled.h3`
  margin: 0;
  color: #000;
`

const CloseButton = styled(Image)`
  cursor: pointer;
`

const NFTImage = styled.img`
  width: 150px;
  aspect-ratio: 1;
  border-radius: 10px;
`

const ImageWrapper = styled.div`
  width: 150px;
  aspect-ratio: 1;
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #c9c9c9;
`

const ImageContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`

const AttributeContainer = styled.div`
  margin-top: 5px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`

const AttributeTitle = styled.div`
  font-weight: 600;
`

const AttributeValue = styled.div``

const Price = styled.div`
  text-align: center;
  font-weight: 600;
`

const NFTDetailModal = ({ nft }: { nft: any }) => {
  const { closeModal, openModal } = useModal()
  const { userAddress } = useAuth()
  console.log(nft)
  return (
    <Container onClick={(e) => e.stopPropagation()}>
      <Header>
        <HeaderTitle>Car Detail #{nft?.nftId}</HeaderTitle>
        <CloseButton onClick={() => closeModal()} src={closeIcon} alt='close' />
      </Header>
      <ImageContainer>
        <ImageWrapper>
          <NFTImage src={nft?.image} alt='nft' />
        </ImageWrapper>
      </ImageContainer>
      <Price className='MT20'>Price: 100KLAY</Price>
      <AttributeContainer className='MT20'>
        <AttributeTitle>Name</AttributeTitle>
        <AttributeValue>{nft?.name}</AttributeValue>
      </AttributeContainer>
      <AttributeContainer>
        <AttributeTitle>Brand</AttributeTitle>
        <AttributeValue>{nft?.type === '1' ? 'MC Laren' : 'Porsche'}</AttributeValue>
      </AttributeContainer>
      <AttributeContainer>
        <AttributeTitle>VIN</AttributeTitle>
        <AttributeValue>{nft?.type === '1' ? `MC${new Date(nft.createdAt).getTime()}` : `P${new Date(nft.createdAt).getTime()}`}</AttributeValue>
      </AttributeContainer>
      {nft?.owner === userAddress?.toLowerCase() && (
        <PrimaryButton
          onClick={() =>
            openModal({
              children: <SellModal nft={nft} />,
              id: 'sell-modal',
            })
          }
          height='40px'
          className='MT30 MB10'
          width='70%'
        >
          Sell
        </PrimaryButton>
      )}
      {nft?.owner !== userAddress?.toLowerCase() && (
        <PrimaryButton height='40px' className='MT30 MB10' width='70%'>
          Buy
        </PrimaryButton>
      )}
    </Container>
  )
}

export default NFTDetailModal
