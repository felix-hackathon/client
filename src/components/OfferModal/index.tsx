import { ethers } from 'ethers'
import { useState } from 'react'
import Image from 'next/image'
import { styled } from 'styled-components'
import closeIcon from '@/assets/icons/close.svg'
import useModal from '@/hooks/core/useModal'
import useAuth from '@/hooks/core/useAuth'

import AppConfig from '@/config'
import { fetcher } from '@/services/api'
import Web3Service from '@/services/web3'
import exchangeABI from '@/services/web3/exchangeABI'
import { mutate } from 'swr'
import { useRouter } from 'next/navigation'
import { ellipsisAddress } from '@/common/functions'
import Loading from '../UI/Loading'

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

const Title = styled.div``

const ListContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: relative;
`

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.8);
  cursor: not-allowed;
`

const ItemContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 5px;
`

const ItemTitle = styled.div`
  font-size: 14px;
`

const ItemButtonContainer = styled.div`
  display: flex;
  gap: 5px;
  align-items: center;
`

const ItemButton = styled.img`
  width: 20px;
  height: 20px;
  cursor: pointer;
`

const OfferModal = ({ nft }: { nft: any }) => {
  const { closeModal, openModal, closeAll } = useModal()
  const { userAddress } = useAuth()
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  console.log(nft?.offer)
  const handleAcceptOffer = async (offer: any) => {
    setLoading(true)
    const quoteType = '1' //(0 = BID, 1 = ASK)
    const orderNonce = '1' // unique number
    const collectionType = '1' // (0 = 721, 1 = 6551)
    const collection = nft?.nftAddress
    const tokenId = nft?.nftId
    const currency = ethers.ZeroAddress
    const price = offer?.priceWei
    const signer = userAddress || ''
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

    const recipient = offer?.buyerAddress || ''
    const takerSignature = offer?.signatureBuyer || '0x'

    const taker: any[] = [recipient, takerSignature]
    const order = [maker, taker]
    const KaikasService = (await import('@/services/kaikas')).default
    let rawTx: string = ''
    rawTx = await KaikasService.signTransaction({
      type: 'FEE_DELEGATED_SMART_CONTRACT_EXECUTION',
      to: AppConfig.fireflyExchange,
      value: '0',
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

  const handleCancel = async (id: string) => {
    setLoading(true)
    const resCancel = await fetcher({
      url: '/nft/reject',
      method: 'POST',
      body: {
        id,
      },
    })
    console.log(resCancel)
    await mutate((key: any) => key?.includes('nfts'))
    closeAll()
    setLoading(false)
  }

  return (
    <Container onClick={(e) => e.stopPropagation()}>
      <Header>
        <HeaderTitle>Offer #{nft?.nftId}</HeaderTitle>
        <CloseButton onClick={() => closeModal()} src={closeIcon} alt='close' />
      </Header>
      <ImageContainer>
        <ImageWrapper>
          <NFTImage src={nft?.image} alt='nft' />
        </ImageWrapper>
      </ImageContainer>
      <Title className='MT10 MB10'>List Offer</Title>
      <ListContainer>
        {nft?.offer?.map((offer: any) => (
          <ItemContainer key={offer?._id}>
            <ItemTitle>
              From {ellipsisAddress(offer?.buyerAddress)}: {offer?.price} KLAY
            </ItemTitle>
            <ItemButtonContainer>
              <ItemButton
                onClick={() => handleCancel(offer?._id)}
                src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAThJREFUaEPtWEEOwjAMc382XgY/g58NDTSpmro1saOVoexKk9ixm7YUXPwrF8ePJDBawVQgFRA7kBYSGyiHpwJyC8UEqYDYQDmcVmAGHgDuAG4FeDFIInJQBKrCK243iYgcS3E3gRmYADwbHTeTaID/pCsEHjeBpdAeAIudlNiWTSkCLIlo8JSF6i54AHnWegYCrcBaxALMssYDul4rE+jZCd9Nv4zb7Wfe9EfkQgh0SLTqh4CX98AW2YFV6qVh4MMJGJQIBZ8E/spCRv/Td6e9SRQyhY7m/M+PUcshZVkz5CDzAPOs9ZChLcQAYmJ6ZCgCChAlNuQ6/a8PGvcJO+xJ2bhGu8FH5qD2QAVgYv+RiMohEehNiDN+TwJndPmUF9koImmhUZ1f66YCqYDYgbSQ2EA5/PIKvAEE23AxKOuJKAAAAABJRU5ErkJggg=='
              />
              <ItemButton
                onClick={() => handleAcceptOffer(offer)}
                src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAATtJREFUaEPtl9ENwjAMRB0mgxUQ+wD7IFaAySgKUFVKG+L47KSVnC8kGnPvLo1NoI2vsHH95AC9E/QEPAHQAT9CoIHwdk8AthAs4AmABsLbPQHYwrTAcNpTuD25ddeVwHC8ENGZiK4U7vFzca0HYBI/imZBrANgLv4HsTuUjlN/gKx43jHqCwCKjzH1A1AQ3w9ASXwfAEXx7QGUxcsBKrvl5040EC8DEHRLK/H1AJJuaeT82K7512g8NvR6LAwn+ZZvLF4jgfzc0kB8PQD3ZWwkXgZQgvhmEkfidLGmy+L8nDzAfwfSynmXlzSYiJcnMErkQZiJxwH+H6f4ral4HYA8hLl4PYA5RBPxugATBHH/kNfeOEvPy28hjV9XqOEACiZCJTwByD6FzZ6AgolQCU8Ask9hsyegYCJU4g1hwXMxYAtXZQAAAABJRU5ErkJggg=='
              />
            </ItemButtonContainer>
          </ItemContainer>
        ))}
        {loading && (
          <LoadingOverlay>
            <Loading />
          </LoadingOverlay>
        )}
      </ListContainer>
    </Container>
  )
}

export default OfferModal
