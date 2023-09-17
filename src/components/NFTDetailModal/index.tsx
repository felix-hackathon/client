import { ethers } from 'ethers'
import { useMemo, useState } from 'react'
import Image from 'next/image'
import { styled } from 'styled-components'
import closeIcon from '@/assets/icons/close.svg'
import useModal from '@/hooks/core/useModal'
import useAuth from '@/hooks/core/useAuth'

import AppConfig from '@/config'
import { fetcher } from '@/services/api'
import Web3Service from '@/services/web3'
import exchangeABI from '@/services/web3/exchangeABI'
import PrimaryButton from '../UI/Button/Primary'
import SellModal from '../RequestModal'
import { mutate } from 'swr'
import { useRouter } from 'next/navigation'
import OfferModal from '../OfferModal'
import { ellipsisAddress } from '@/common/functions'

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
  const { closeModal, openModal, closeAll } = useModal()
  const { userAddress } = useAuth()
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const fromOffer = useMemo(() => {
    return nft.offer?.find((i: any) => i.buyerAddress === userAddress?.toLowerCase())
  }, [nft, userAddress])

  const handleBuy = async () => {
    setLoading(true)
    const quoteType = '0' //(0 = BID, 1 = ASK)
    const orderNonce = '1' // unique number
    const collectionType = '1' // (0 = 721, 1 = 6551)
    const collection = nft?.nftAddress
    const tokenId = nft?.nftId
    const currency = ethers.ZeroAddress
    const price = nft?.market?.priceWei
    const signer = nft?.market?.sellerAddress
    const startTime = 0
    const endTime = ethers.MaxUint256.toString()
    const assets = [AppConfig.rimAddress, AppConfig.brakeDiskAddress]
    const values = [1, 2] // assets inside tba
    const makerSignature = nft?.market?.signatureSeller

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

    const recipient = userAddress || ''
    const takerSignature = '0x'

    const taker: any[] = [recipient, takerSignature]
    const order = [maker, taker]
    const KaikasService = (await import('@/services/kaikas')).default
    let rawTx: string = ''
    rawTx = await KaikasService.signTransaction({
      type: 'FEE_DELEGATED_SMART_CONTRACT_EXECUTION',
      to: AppConfig.fireflyExchange,
      value: nft?.market?.priceWei,
      data: Web3Service.encodeAbi(exchangeABI as any, 'executeOrder', order),
      gas: '1800000',
      from: userAddress as string,
    }).catch((e) => {
      console.log(e)
      return null
    })

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
        await mutate((key: any) => key?.includes('nfts'))
        await closeAll()
        router.push('/garage')
      }
    }
    setLoading(false)
  }

  const handleCancel = async () => {
    setLoading(true)
    const resCancel = await fetcher({
      url: '/nft/cancel',
      method: 'POST',
      body: {
        address: nft?.nftAddress,
        id: nft?.nftId,
        chainId: nft?.chainId,
      },
    })

    console.log(resCancel)
    await mutate((key: any) => key?.includes('nfts'))
    await closeAll()
    setLoading(false)
  }

  const handleCancelOffer = async () => {
    setLoading(true)
    const resCancel = await fetcher({
      url: '/nft/reject',
      method: 'POST',
      body: {
        id: fromOffer?._id,
      },
    })

    console.log(resCancel)
    await mutate((key: any) => key?.includes('nfts'))
    await closeAll()
    setLoading(false)
  }

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
      {nft?.market?.price && <Price className='MT20'>Price: {nft?.market?.price} KLAY</Price>}
      <AttributeContainer className='MT20'>
        <AttributeTitle>Name</AttributeTitle>
        <AttributeValue>{nft?.name}</AttributeValue>
      </AttributeContainer>
      <AttributeContainer>
        <AttributeTitle>Owner</AttributeTitle>
        <AttributeValue>{ellipsisAddress(nft?.owner)}</AttributeValue>
      </AttributeContainer>
      <AttributeContainer>
        <AttributeTitle>Brand</AttributeTitle>
        <AttributeValue>{nft?.type === '1' ? 'MC Laren' : 'Porsche'}</AttributeValue>
      </AttributeContainer>
      <AttributeContainer>
        <AttributeTitle>VIN</AttributeTitle>
        <AttributeValue>{nft?.type === '1' ? `MC${new Date(nft.createdAt).getTime()}` : `P${new Date(nft.createdAt).getTime()}`}</AttributeValue>
      </AttributeContainer>
      {nft?.offer?.length > 0 && nft?.owner === userAddress?.toLowerCase() ? (
        <PrimaryButton
          onClick={() => {
            openModal({
              children: <OfferModal nft={nft} />,
              id: 'offer',
            })
          }}
          height='40px'
          className='MT30 MB10'
          width='70%'
          loading={loading}
        >
          View Offer
        </PrimaryButton>
      ) : (
        <>
          {nft?.owner === userAddress?.toLowerCase() && (
            <>
              {!nft?.market ? (
                <PrimaryButton
                  onClick={() =>
                    openModal({
                      children: <SellModal nft={nft} quoteType={1} />,
                      id: 'sell-modal',
                    })
                  }
                  height='40px'
                  className='MT30 MB10'
                  width='70%'
                >
                  Sell
                </PrimaryButton>
              ) : (
                <PrimaryButton height='40px' className='MT30 MB10' width='70%' loading={loading} onClick={() => handleCancel()}>
                  Cancel
                </PrimaryButton>
              )}
            </>
          )}
          {nft?.owner !== userAddress?.toLowerCase() && (
            <>
              {nft?.market ? (
                <PrimaryButton loading={loading} onClick={() => handleBuy()} height='40px' className='MT30 MB10' width='70%'>
                  Buy
                </PrimaryButton>
              ) : (
                <>
                  {fromOffer ? (
                    <PrimaryButton onClick={() => handleCancelOffer()} height='40px' className='MT30 MB10' width='70%'>
                      Cancel Offer
                    </PrimaryButton>
                  ) : (
                    <PrimaryButton
                      onClick={() =>
                        openModal({
                          children: <SellModal nft={nft} quoteType={0} />,
                          id: 'offer-modal',
                        })
                      }
                      height='40px'
                      className='MT30 MB10'
                      width='70%'
                    >
                      Offer
                    </PrimaryButton>
                  )}
                </>
              )}
            </>
          )}
        </>
      )}
    </Container>
  )
}

export default NFTDetailModal
