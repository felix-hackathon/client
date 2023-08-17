import { styled } from 'styled-components'
import React, { useCallback, useEffect, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import dynamic from 'next/dynamic'
import useToken from '@/hooks/swap/useToken'
import { convertBalanceToWei, convertWeiToBalance } from '@/common/functions/math'
import Skeleton from '../UI/Skeleton'
import useBalance from '@/hooks/core/useBalance'
import useAuth from '@/hooks/core/useAuth'
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

export type TokenInput = { token: string; amount: string; chainId: number; decimals: number }

const SwapInput = React.forwardRef(
  (
    {
      title,
      readOnly,
      chainId,
      onChange,
      loading,
      error,
      value,
    }: {
      title: string
      readOnly?: boolean
      loading?: boolean
      chainId: number
      value?: TokenInput
      error?: any
      onChange?: (v: TokenInput) => void
    },
    ref: any
  ) => {
    const { userAddress } = useAuth()
    const [address, setAddress] = useState(value?.token || '')
    const { token } = useToken(address, chainId)
    const [amount, setAmount] = useState(value?.amount || '')
    const { balance } = useBalance({
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
        })
      }
    }, [address, token, chainId, amount, onChange])

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
              disabled={readOnly}
              type='number'
            />
          )}
          <SelectToken isError={!!error?.token} chainId={chainId} value={address} onChange={handleChangeToken} />
        </InputContainer>
        {balance ? (
          <Balance>
            Balance: {convertWeiToBalance(balance, token?.decimals)} {!readOnly && <span onClick={() => setAmount(balance)}>Max</span>}
          </Balance>
        ) : (
          <Balance />
        )}
      </Container>
    )
  }
)

const SwapFormField = ({
  chainId,
  title,
  readOnly,
  name,
  loading,
}: {
  name: string
  title: string
  readOnly?: boolean
  loading?: boolean
  chainId: number
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext()
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => <SwapInput {...field} error={errors?.[name]} title={title} chainId={chainId} loading={loading} readOnly={readOnly} />}
    />
  )
}
export default SwapFormField
