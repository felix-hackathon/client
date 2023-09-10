import { Car, CarContext } from '@/app/(app)/store/[slug]/page.client'
import BigNumber from 'bignumber.js'
import { useContext, useMemo, useState } from 'react'
import { styled } from 'styled-components'
import PrimaryButton from '@/components/UI/Button/Primary'
import useToken from '@/hooks/useToken'
import useAuth from '@/hooks/core/useAuth'
import { fetcher } from '@/services/api'
import Web3Service from '@/services/web3'
import carABI from '@/services/web3/carABI'
import SelectToken from '../SelectToken'

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0px 20px;
`

const Title = styled.h1`
  width: 100%;
  text-align: center;
  color: #fff;
`

const Total = styled.h2`
  margin: 0;
  margin-top: 20px;
  width: 100%;
  color: #fff;
  font-weight: 400;
`
const Detail = styled.h3`
  margin: 0;
  width: 100%;
  color: #fff;
  font-weight: 400;
`

const InfoContainer = styled.div`
  width: 100%;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 15px;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.1);
`

const SelectPaymentCurrency = styled.h4`
  margin: 0;
  width: 100%;
  color: #f2f2f2;
  font-weight: 400;
`

const SelectTokenContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
`

const AmountToken = styled.div`
  color: #fff;
`

const Buy = ({ slug }: { slug: string }) => {
  const { config } = useContext(CarContext)
  const { userAddress } = useAuth()
  const [tokenAddress, setTokenAddress] = useState('0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee')
  const { token } = useToken({
    chainId: 8217,
    address: tokenAddress,
  })

  const [loading, setLoading] = useState(false)

  const data = useMemo(() => {
    const carConfig = Car[slug]
    let result: {
      name: string
      address: string
      type: string
      price: string
      total: string
      attribute: { name: string; address: string; value: { name: string; type: string; price: string; icon?: string } }[]
    } = {
      name: carConfig.name,
      address: carConfig.address,
      type: carConfig.type,
      price: carConfig.price,
      total: carConfig.price,
      attribute: [],
    }
    carConfig.attribute.forEach((ele) => {
      const value = ele.options.find((i) => i.key === (config as any)?.[ele.key])
      if (value) {
        result.total = BigNumber(result.total).plus(BigNumber(value.price)).toString()
        result.attribute.push({
          name: ele.name,
          address: ele.address,
          value: {
            name: value.name,
            price: value.price,
            type: value.type,
            icon: value.icon,
          },
        })
      }
    })
    return result
  }, [slug, config])

  const handleBuy = async () => {
    setLoading(true)
    const values = [data?.type, data?.attribute?.map((attribute) => [attribute.address, attribute.value.type]), userAddress]
    const KaikasService = (await import('@/services/kaikas')).default
    const rawTx = await KaikasService.signTransaction({
      type: 'FEE_DELEGATED_SMART_CONTRACT_EXECUTION',
      to: '0xC442E3959d5c84fC23BB415efcB1f3aab408Da76',
      data: Web3Service.encodeAbi(carABI, 'safeMint', values),
      gas: '710000',
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
      return resTx
    }
    setLoading(false)
  }

  return (
    <Container>
      <Title>Purchase</Title>
      <Total>Total: {data.total} KLAY</Total>
      <InfoContainer>
        {data.attribute.map((i) => (
          <Detail key={`${i.address}-${i.value.type}`}>
            {i.name}: {i.value.name} - {i.value.price} KLAY
          </Detail>
        ))}
      </InfoContainer>
      <InfoContainer>
        <SelectPaymentCurrency>Select Payment Currency</SelectPaymentCurrency>
        <SelectTokenContainer>
          <AmountToken>
            {data?.total} {token?.symbol}
          </AmountToken>
          <SelectToken value={tokenAddress} onChange={(v) => setTokenAddress(v)} chainId={8217} />
        </SelectTokenContainer>
      </InfoContainer>
      <PrimaryButton onClick={() => handleBuy()} loading={loading} width='300px' className='MT50 MB20'>
        Buy
      </PrimaryButton>
    </Container>
  )
}

export default Buy
