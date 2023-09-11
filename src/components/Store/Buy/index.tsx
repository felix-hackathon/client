import { parseUnits, MaxUint256, ethers } from 'ethers'
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
import AppConfig from '@/config'
import routerABI from '@/services/web3/routerABI'
import useTokenAmount from '@/hooks/useTokenAmount'
import { NativeTokens } from '@/common/constants/web3'
import gatewayABI from '@/services/web3/gatewayABI'
import { useRouter } from 'next/navigation'

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
    chainId: AppConfig.chainId,
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

  const { tokenAmount } = useTokenAmount({
    amountOut: ethers.parseUnits(data?.total || '0', 18).toString(),
    chainId: AppConfig.chainId,
    tokenAddress: token?.address,
    userAddress: userAddress as string,
  })

  const router = useRouter()

  const handleBuy = async () => {
    setLoading(true)
    const values = [data?.type, data?.attribute?.map((attribute) => [attribute.address, attribute.value.type]), userAddress]
    const KaikasService = (await import('@/services/kaikas')).default
    let rawTx: string = ''
    if (NativeTokens.includes(token?.address)) {
      rawTx = await KaikasService.signTransaction({
        type: 'FEE_DELEGATED_SMART_CONTRACT_EXECUTION',
        to: AppConfig.carAddress,
        value: parseUnits(data?.total.toString(), 18).toString(),
        data: Web3Service.encodeAbi(carABI as any, 'buy', values),
        gas: '1400000',
        from: userAddress as string,
      }).catch((e) => {
        console.log(e)
        return null
      })
    } else {
      const tokenOutAmount = ethers.parseUnits(data?.total || '0', 18).toString()
      // const tokenInAmount = await Web3Service.getTokenInAmount(AppConfig.chainId, userAddress as string, token?.address, tokenOutAmount)
      const tokenInAmount = await Web3Service.getAmountsIn({
        amountOut: tokenOutAmount,
        chainId: AppConfig.chainId,
        path: [token.address, AppConfig.WKLAY],
      })
      rawTx = await KaikasService.signTransaction({
        type: 'FEE_DELEGATED_SMART_CONTRACT_EXECUTION',
        to: AppConfig.paymentGateway,
        value: '0',
        data: Web3Service.encodeAbi(gatewayABI as any, 'execute', [
          [token?.address, tokenInAmount, ethers.ZeroAddress, tokenOutAmount],
          [
            AppConfig.exchangeRouter,
            '0',
            Web3Service.encodeAbi(routerABI, 'swapTokensForExactKLAY', [tokenOutAmount, MaxUint256, [token.address, AppConfig.WKLAY], userAddress, MaxUint256]),
          ],
          [AppConfig.carAddress, tokenOutAmount, Web3Service.encodeAbi(carABI as any, 'buy', values)],
        ]),
        gas: '1700000',
        from: userAddress as string,
      })
    }
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
        router.push('/garage')
      }
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
            {ethers.formatUnits(tokenAmount, token?.decimals)} {token?.symbol}
          </AmountToken>
          <SelectToken value={tokenAddress} onChange={(v) => setTokenAddress(v)} chainId={AppConfig.chainId} />
        </SelectTokenContainer>
      </InfoContainer>
      <PrimaryButton onClick={() => handleBuy()} loading={loading} width='300px' className='MT50 MB20'>
        Buy
      </PrimaryButton>
    </Container>
  )
}

export default Buy
