import { css, styled } from 'styled-components'
import Image from 'next/image'
import { useCallback, useEffect } from 'react'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import useDebounce from '@/hooks/core/useDebounnce'
import dynamic from 'next/dynamic'
import arrowDown from '@/assets/icons/arrow-down.svg'
import useQuote from '@/hooks/swap/useQuote'
import { CHAINS } from '@/common/constants/chains'
const Form = dynamic(() => import('../UI/Form'))
const SwapFormField = dynamic(() => import('./Input'))

const Container = styled(Form)`
  z-index: 1;
  width: 100%;
  max-width: 700px;
  transform: skewX(-4deg);
  box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.3);
  display: flex;
`

const SwapInputContainer = styled.div`
  flex: 1;
  height: 300px;
  padding: 10px 30px 10px 15px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const SwapButton = styled.button`
  width: 150px;
  padding: 10px;
  background-color: #444;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  font-size: 24px;
  color: #fff;
  border: none;
  cursor: pointer;
  user-select: none;
  &:active {
    background-color: #666;
  }
  position: relative;
  ${(props) =>
    props.disabled &&
    css`
      cursor: not-allowed;
      &:active {
        background-color: #444;
      }
    `}
`

const Error = styled.div`
  position: absolute;
  top: 5px;
  left: 5px;
  right: 10px;
  color: red;
  font-size: 14px;
  text-align: right;
`

const SwapIcon = styled.div`
  width: 30px;
  display: flex;
  justify-content: center;
  align-self: flex-end;
  align-items: center;
  aspect-ratio: 1;
  border-radius: 50%;
  background-color: #444;
  transition: 0.2s ease;
  cursor: pointer;
  &:hover {
    transform: rotate(180deg);
  }
`

const schema = yup.object({
  from: yup.object({
    token: yup.string().required('Token is required'),
    amount: yup.string().required('Amount is required'),
    chainId: yup.number().required(),
    decimals: yup.number().required(),
  }),
  to: yup.object({
    token: yup.string().required('Token is required'),
    amount: yup.string().required('Amount is required'),
    chainId: yup.number().required(),
    decimals: yup.number().required(),
  }),
})

const SwapCard = ({ chainId }: { chainId: number }) => {
  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      from: {
        amount: '',
        token: '',
        chainId: chainId,
      },
      to: {
        amount: '',
        token: '',
        chainId: chainId,
      },
    },
  })

  const watchFrom = form.watch('from')
  const from = useDebounce<any>(watchFrom, 600)
  const watchTo = form.watch('to')
  const to = useDebounce<any>(watchTo, 600)

  const { loadingQuote, quoteData, error } = useQuote(chainId, {
    src: from.token,
    dst: to.token,
    amount: from.amount,
  })

  // const { trigger, swapError, swapData, loadingSwap } = useSwap(chainId)
  // console.log('swapData', swapData)
  useEffect(() => {
    if (to.token && to.token !== from.token) {
      if (from.amount !== '') {
        if (quoteData && from.amount !== '') {
          form.setValue('to.amount', quoteData.toAmount)
        }
      } else {
        form.setValue('to.amount', '')
      }
    } else {
      form.setValue('to.amount', from.amount)
    }
  }, [form, from, to.token, quoteData])

  const handleSwitch = useCallback(() => {
    form.setValue('to', from)
    form.setValue('from', to)
  }, [form, from, to])

  return (
    <Container
      form={form}
      onSubmit={(v) => {
        // trigger({ ...v, userAddress: account })
      }}
    >
      <SwapInputContainer>
        <SwapFormField chainId={chainId} title={`From ${CHAINS?.find((i) => i.id === chainId)?.name}`} name='from' />
        <SwapIcon onClick={handleSwitch}>
          <Image src={arrowDown} alt='icon-swap' />
        </SwapIcon>
        <SwapFormField loading={loadingQuote} readOnly chainId={chainId} name='to' title={`To ${CHAINS?.find((i) => i.id === chainId)?.name}`} />
      </SwapInputContainer>
      <SwapButton disabled={!!error?.message} type='submit'>
        {error?.message && <Error>{error?.message}</Error>}
        {/* {swapError?.message && <Error>{swapError?.message}</Error>}
        {loadingSwap ? 'Swap Loading...' : 'Swap'} */}
      </SwapButton>
    </Container>
  )
}

export default SwapCard
