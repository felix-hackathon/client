import { styled } from 'styled-components'
import selectIcon from '@/assets/icons/select.svg'
import selectErrorIcon from '@/assets/icons/select-error.svg'
import Image from 'next/image'
import useModal from '@/hooks/core/useModal'
import { useCallback, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

const SelectTokenModal = dynamic(() => import('./SelectTokenModal'))
const TokenImage = dynamic(() => import('./TokenImage'))

const Container = styled.div`
  display: flex;
  gap: 10px;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
`
const SelectToken = ({ chainId, onChange, value, isError }: { chainId: number; onChange?: (v: string) => void; value?: string; isError?: boolean }) => {
  const { openModal } = useModal()
  const [token, setToken] = useState(value || '')

  useEffect(() => {
    setToken(value || '')
  }, [value])

  const handleChange = useCallback(
    (v: string) => {
      setToken(v)
      if (onChange) {
        onChange(v)
      }
    },
    [onChange]
  )

  return (
    <Container
      onClick={() => {
        openModal({
          id: 'select-token-modal',
          children: <SelectTokenModal chainId={chainId} value={token} onChange={handleChange} />,
        })
      }}
    >
      <Image src={isError ? selectErrorIcon : selectIcon} alt='select-icon' width={12} height={12} />
      <TokenImage isError={isError} address={token} chainId={chainId} />
    </Container>
  )
}

export default SelectToken
