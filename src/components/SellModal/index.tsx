import Image from 'next/image'
import { styled } from 'styled-components'
import closeIcon from '@/assets/icons/close.svg'
import useModal from '@/hooks/core/useModal'
import PrimaryButton from '../UI/Button/Primary'
import { useState } from 'react'
import KaikasService from '@/services/kaikas'
import useAuth from '@/hooks/core/useAuth'
import { ethers } from 'ethers'
import { sleep } from '@/common/functions'
import Web3Service from '@/services/web3'

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
    const nonceNFT = await Web3Service.getNoncesNFT({
      chainId: 1001,
      nftAddress: nft?.nftAddress,
      tokenId: nft?.nftId,
    })
    console.log('nonceNFT', nonceNFT)
    const signNFT = await KaikasService.signTypedData({
      from: userAddress || '',
      domain: {
        name: 'Car',
        version: '1',
        chainId: 1001,
        verifyingContract: nft?.nftAddress,
      },
      types: {
        Permit: [
          {
            name: 'spender',
            type: 'address',
          },
          {
            name: 'tokenId',
            type: 'uint256',
          },
          {
            name: 'nonce',
            type: 'uint256',
          },
          {
            name: 'deadline',
            type: 'uint256',
          },
        ],
      },
      primaryType: 'Permit',
      message: {
        spender: '0xc95C0EC40937aD81F34c8b0836680b7681b7bF60',
        tokenId: nft?.nftId,
        nonce: `${nonceNFT}`,
        deadline: ethers.MaxUint256.toString(),
      },
    })
    await sleep(1000)
    const sign = await KaikasService.signTypedData({
      from: userAddress || '',
      domain: {
        name: 'ExchangeNFT',
        version: '1',
        chainId: 8217,
        verifyingContract: '0xc95C0EC40937aD81F34c8b0836680b7681b7bF60',
      },
      primaryType: 'SellerOrder',
      types: {
        SellerOrder: [
          { name: 'signer', type: 'address' },
          { name: 'collection', type: 'address' },
          { name: 'price', type: 'uint256' },
          { name: 'tokenId', type: 'uint256' },
          { name: 'currency', type: 'address' },
          { name: 'nonce', type: 'uint256' },
          { name: 'startTime', type: 'uint256' },
          { name: 'endTime', type: 'uint256' },
          { name: 'permit', type: 'bytes' },
        ],
      },
      message: {
        signer: userAddress,
        collection: nft?.nftAddress,
        price: ethers.parseUnits(price, 18).toString(),
        tokenId: nft?.nftId,
        currency: ethers.ZeroAddress,
        nonce: '1',
        startTime: 0,
        endTime: ethers.MaxUint256.toString(),
        permit: signNFT,
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
