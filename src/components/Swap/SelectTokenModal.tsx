import Image from 'next/image'
import { css, styled } from 'styled-components'
import closeIcon from '@/assets/icons/close.svg'
import useModal from '@/hooks/core/useModal'
import useTokens from '@/hooks/swap/useTokens'
import emptyToken from '@/assets/icons/tokens/empty-token.webp'
import Loading from '../UI/Loading'
import { useCallback, useState } from 'react'
import useBalances from '@/hooks/core/useBalances'
import useAuth from '@/hooks/core/useAuth'
import { convertWeiToBalance } from '@/common/functions/math'
const Container = styled.div`
  width: 440px;
  padding: 10px;
  background-color: #fff;
  transform: skewX(-2deg);
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

const ListContainer = styled.div`
  height: 400px;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`

const TokenContainer = styled.div<any>`
  padding: 15px 10px;
  background-color: #f2f2f2;
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  ${(props) =>
    props.$active &&
    css`
      border: 1px solid #999;
    `}
`

const Token = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

const TokenNameContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const TokenName = styled.div`
  color: #333;
  font-size: 14px;
`

const TokenBalance = styled.div`
  font-size: 12px;
  font-weight: 300;
  color: #828282;
`

const SelectTokenModal = ({ chainId, value, onChange }: { chainId: number; value?: string; onChange?: (value: string) => void }) => {
  const { closeModal } = useModal()
  const { account } = useAuth()
  const { tokens, loadingTokens } = useTokens(chainId)
  const { balances } = useBalances({
    chainId,
    userAddress: account || '',
    tokenAddresses: tokens.map((i: any) => i.address),
  })

  console.log(balances, 'balances')
  const [data, setData] = useState(value)

  const handleChange = useCallback(
    (v: string) => {
      setData(v)
      if (onChange) {
        onChange(v)
      }
      closeModal()
    },
    [onChange, closeModal]
  )

  return (
    <Container>
      <Header>
        <HeaderTitle>Select a token</HeaderTitle>
        <CloseButton onClick={() => closeModal()} src={closeIcon} alt='close' />
      </Header>
      <ListContainer>
        {loadingTokens ? (
          <Loading wrapper={{ height: '100%' }} size='50px' />
        ) : (
          tokens?.map((token: any) => (
            <TokenContainer key={`${token?.address}-${token?.chainId}`} $active={data === token?.address} onClick={() => handleChange(token?.address)}>
              <Token>
                {token?.icon ? (
                  <Image src={token?.icon} alt='token' width={30} height={30} />
                ) : (
                  <Image src={emptyToken} alt='empty-token' width={30} height={30} />
                )}
                <TokenNameContainer>
                  <TokenName>{token?.name}</TokenName>
                  {balances?.[token?.address] && <TokenBalance>Balance: {convertWeiToBalance(balances[token?.address], token?.decimals)}</TokenBalance>}
                </TokenNameContainer>
              </Token>
            </TokenContainer>
          ))
        )}
      </ListContainer>
    </Container>
  )
}

export default SelectTokenModal
