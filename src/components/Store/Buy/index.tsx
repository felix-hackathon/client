import { Car, CarContext } from '@/app/store/[slug]/page.client'
import BigNumber from 'bignumber.js'
import { useContext, useMemo } from 'react'
import { styled } from 'styled-components'
import SelectToken from '../SelectToken'
import PrimaryButton from '@/components/UI/Button/Primary'
import useToken from '@/hooks/useToken'

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
  const { token } = useToken({
    chainId: 8217,
    address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
  })
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
  console.log(data)
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
            {data?.total} {token.symbol}
          </AmountToken>
          <SelectToken />
        </SelectTokenContainer>
      </InfoContainer>
      <PrimaryButton width='300px' className='MT50 MB20'>
        Buy
      </PrimaryButton>
    </Container>
  )
}

export default Buy
