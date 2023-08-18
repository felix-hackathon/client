import { styled } from 'styled-components'
import React, { useCallback, useEffect, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import dynamic from 'next/dynamic'
import useToken from '@/hooks/swap/useToken'
import { convertBalanceToWei, convertWeiToBalance } from '@/common/functions/math'
import Skeleton from '../UI/Skeleton'
import useAuth from '@/hooks/core/useAuth'
import useFromTokenInfo from '@/hooks/swap/useFromTokenInfo'
const SelectToken = dynamic(() => import('./SelectToken'))

const Container = styled.div`
  height: 110px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const Title = styled.h3`
  margin: 0;
  color: #444;
`

const Balance = styled.h5`
  margin: 0;
  height: 20px;
  color: #777;
  display: flex;
  justify-content: space-between;
  span {
    color: #333;
    cursor: pointer;
  }
`

const InputContainer = styled.div`
  display: flex;
  gap: 20px;
`

const Input = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-size: 28px;
  font-weight: 500;
  color: #828282;
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button,
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  &[type='number'],
  input[type='number'] {
    -moz-appearance: textfield;
  }
  &:disabled {
    cursor: not-allowed;
  }
`

export type TokenFromInput = { token: string; amount: string; chainId: number; decimals: number; userBalance: string; allowance: string; hasPermit: boolean }

const SwapInputFrom = React.forwardRef(
  (
    {
      title,
      chainId,
      onChange,
      loading,
      error,
      value,
    }: {
      title: string
      loading?: boolean
      chainId: number
      value?: TokenFromInput
      error?: any
      onChange?: (v: TokenFromInput) => void
    },
    ref: any
  ) => {
    const { userAddress } = useAuth()
    const [address, setAddress] = useState(value?.token || '')
    const { token } = useToken(address, chainId)
    const [amount, setAmount] = useState(value?.amount || '')
    const { info } = useFromTokenInfo({
      chainId,
      tokenAddress: address,
      userAddress: userAddress || '',
    })

    useEffect(() => {
      if (onChange) {
        onChange({
          amount,
          token: address,
          chainId,
          decimals: token?.decimals,
          allowance: info?.allowance,
          hasPermit: info?.hasPermit,
          userBalance: info?.balance,
        })
      }
    }, [address, token, chainId, amount, onChange, info.allowance, info.balance, info.hasPermit])

    useEffect(() => {
      setAddress(value?.token || '')
    }, [value?.token])

    useEffect(() => {
      setAmount(value?.amount || '')
    }, [value?.amount])

    const handleChangeToken = useCallback((v: string) => {
      setAddress(`${v}`)
    }, [])

    const handleChangeAmount = useCallback(
      (v: string) => {
        setAmount(v ? convertBalanceToWei(v, token?.decimals).toString() : '')
      },
      [token]
    )

    return (
      <Container>
        <Title>{title}</Title>
        <InputContainer>
          {loading ? (
            <Skeleton>
              <Skeleton.Text />
            </Skeleton>
          ) : (
            <Input
              ref={ref}
              value={amount ? convertWeiToBalance(amount, token?.decimals) : ''}
              onChange={(e) => handleChangeAmount(e.target.value)}
              type='number'
            />
          )}
          <SelectToken isError={!!error?.token} chainId={chainId} value={address} onChange={handleChangeToken} />
        </InputContainer>
        {info ? (
          <Balance>
            Balance: {convertWeiToBalance(info.balance, token?.decimals)} <span onClick={() => setAmount(info.balance)}>Max</span>
          </Balance>
        ) : (
          <Balance />
        )}
      </Container>
    )
  }
)

const SwapFromFormField = ({ chainId, title, name, loading }: { name: string; title: string; loading?: boolean; chainId: number }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => <SwapInputFrom {...field} error={errors?.[name]} title={title} chainId={chainId} loading={loading} />}
    />
  )
}
export default SwapFromFormField
