import Image from 'next/image'
import { styled } from 'styled-components'
import closeIcon from '@/assets/icons/close.svg'
import useModal from '@/hooks/core/useModal'
import PrimaryButton from '../UI/Button/Primary'
import { useState } from 'react'
import KaikasService from '@/services/kaikas'
import useAuth from '@/hooks/core/useAuth'
import { ethers } from 'ethers'
import AppConfig from '@/config'

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
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
`

const Label = styled.label`
  width: 100%;
  margin-top: 20px;
`
const Input = styled.input`
  margin-top: 10px;
  width: 100%;
  height: 40px;
  padding: 0px 10px;
  background: transparent;
  outline: none;
  border: 1px solid #c9c9c9;
  font-size: 20px;
  font-weight: 400;
  line-height: 30px;
  color: #333;
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    /* display: none; <- Crashes Chrome on hover */
    -webkit-appearance: none;
    margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
  }
`

const SellModal = ({ nft }: { nft: any }) => {
  const { closeModal } = useModal()
  const { userAddress } = useAuth()
  const [loading, setLoading] = useState(false)
  const [price, setPrice] = useState('')
  const handleSell = async () => {
    setLoading(true)

    /**
     * @notice Maker is the struct for a maker order.
     * @param quoteType Quote type (i.e. 0 = BID, 1 = ASK)
     * @param orderNonce Order nonce (it can be shared across bid/ask maker orders)
     * @param collectionType Collection type (i.e. 0 = ERC721, 1 = ERC6551)
     * @param collection Collection address
     * @param tokenId TokenId
     * @param currency Currency address (@dev address(0) = ETH)
     * @param price Minimum price for maker ask, maximum price for maker bid
     * @param signer Signer address
     * @param startTime Start timestamp
     * @param endTime End timestamp
     * @param items Array of items
     * @param values Array of values
     * @param makerSignature makerSignature (required);
     */

    const sign = await KaikasService.signTypedData({
      from: userAddress || '',
      domain: {
        name: 'FireFlyExchange',
        version: '1',
        chainId: 1001,
        verifyingContract: AppConfig.fireflyExchange,
      },
      primaryType: 'Maker',
      types: {
        Maker: [
          { name: 'quoteType', type: 'uint8' },
          { name: 'orderNonce', type: 'uint256' },
          { name: 'collectionType', type: 'uint8' },
          { name: 'collection', type: 'address' },
          { name: 'tokenId', type: 'uint256' },
          { name: 'currency', type: 'address' },
          { name: 'price', type: 'uint256' },
          { name: 'signer', type: 'address' },
          { name: 'startTime', type: 'uint256' },
          { name: 'endTime', type: 'uint256' },
          { name: 'assets', type: 'address[]' },
          { name: 'values', type: 'uint256[]' },
        ],
      },
      message: {
        quoteType: 0,
        orderNonce: '1',
        collectionType: '1',
        collection: nft?.nftAddress,
        tokenId: nft?.nftId,
        currency: ethers.ZeroAddress,
        price: ethers.parseUnits(price, 18).toString(),
        signer: userAddress,
        startTime: 0,
        endTime: ethers.MaxUint256.toString(),
        // TODO:
        assets: [AppConfig.rimAddress, AppConfig.brakeDiskAddress],
        values: [1, 2],
      },
    }).catch((e) => {
      console.log(e)
      return null
    })
    console.log(sign)

    setLoading(false)
  }

  return (
    <Container onClick={(e) => e.stopPropagation()}>
      <Header>
        <HeaderTitle>Sell Car #{nft?.nftId}</HeaderTitle>
        <CloseButton onClick={() => closeModal()} src={closeIcon} alt='close' />
      </Header>
      <ImageContainer>
        <ImageWrapper>
          <NFTImage src={nft?.image} alt='nft' />
        </ImageWrapper>
      </ImageContainer>
      <Label>Price</Label>
      <Input value={price} onChange={(e) => setPrice(e.target.value)} type='number' />
      <PrimaryButton
        disabled={price === '' || Number(price) <= 0}
        onClick={() => handleSell()}
        loading={loading}
        height='40px'
        width='70%'
        className='MT20 MB10'
      >
        Sell
      </PrimaryButton>
    </Container>
  )
}

export default SellModal
