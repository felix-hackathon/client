import { ethers, parseUnits } from 'ethers'
import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { styled } from 'styled-components'
import closeIcon from '@/assets/icons/close.svg'
import useModal from '@/hooks/core/useModal'
import useAuth from '@/hooks/core/useAuth'

import AppConfig from '@/config'
import { fetcher } from '@/services/api'
import Web3Service from '@/services/web3'
import exchangeABI from '@/services/web3/exchangeABI'
import PrimaryButton from '../UI/Button/Primary'
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
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const NFTDetailModal = ({ nft }: { nft: any }) => {
  const { closeModal, openModal } = useModal()
  const { userAddress } = useAuth()
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleBuy = async () => {
    setLoading(true)
    const quoteType = '1' //(0 = BID, 1 = ASK)
    const orderNonce = '1' // unique number
    const collectionType = '1' // (0 = 721, 1 = 6551)
    const collection = nft
    const tokenId = '1'
    const currency = ethers.ZeroAddress
    const price = ethers.parseUnits('1', 18).toString()
    const signer = '0xSeller'
    const startTime = 0
    const endTime = ethers.MaxUint256.toString()
    const assets = [AppConfig.rimAddress, AppConfig.brakeDiskAddress]
    const values = [1, 2] // assets inside tba
    const makerSignature = '0x'

    const maker: any[] = [
      quoteType,
      orderNonce,
      collectionType,
      collection,
      tokenId,
      currency,
      price,
      signer,
      startTime,
      endTime,
      assets,
      values,
      makerSignature,
    ]

    const recipient = '0xBuyer'
    const takerSignature = '0xIfOrderIsAsk'

    const taker: any[] = [recipient, takerSignature]
    const order = [maker, taker]
    const KaikasService = (await import('@/services/kaikas')).default
    let rawTx: string = ''
    rawTx = await KaikasService.signTransaction({
      type: 'FEE_DELEGATED_SMART_CONTRACT_EXECUTION',
      to: AppConfig.carAddress,
      value: parseUnits('1', 18).toString(),
      data: Web3Service.encodeAbi(exchangeABI as any, 'executeOrder', order),
      gas: '1800000',
      from: userAddress as string,
    }).catch((e) => {
      console.log(e)
      return null
    })
    console.log('rawTx', rawTx)
    if (rawTx) {
      const resTx = await fetcher({
        url: '/1001/transaction',
        method: 'POST',
        body: {
          rawTx,
        },
        throwError: false,
      })
      console.log(resTx)
      if (resTx?.data) {
        await sleep(2000)
        router.push('/garage')
      }
    }
    setLoading(false)
  }

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
              children: <SellModal nft={nft} owner={userAddress} quoteType={0} />,
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
        // Offer code

        // <PrimaryButton
        //   onClick={() =>
        //     openModal({
        //       children: <SellModal nft={nft} owner={'0xOwnerOf(tokenId)'} quoteType={1} />,
        //       id: 'sell-modal',
        //     })
        //   }
        //   height='40px'
        //   className='MT30 MB10'
        //   width='70%'
        // >
        //   Offer
        // </PrimaryButton>

        // Buy
        <PrimaryButton onClick={() => handleBuy()} height='40px' className='MT30 MB10' width='70%'>
          Buy
        </PrimaryButton>
      )}
    </Container>
  )
}

export default NFTDetailModal
