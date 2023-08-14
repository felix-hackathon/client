import Image, { ImageProps } from 'next/image'
import tokenIcon from '@/assets/icons/tokens/token.svg'
import errorTokenIcon from '@/assets/icons/tokens/token-error.svg'
import useToken from '@/hooks/swap/useToken'
import { ethers } from 'ethers'

type TokenImageProps = {
  width?: number
  height?: number
  className?: string
  isError?: boolean
}

type TokenImageWithAddressAndChainId = {
  address: string
  chainId: number
}
type TokenImageWithSrc = {
  src: string
}

const TokenImage = ({
  address,
  chainId,
  className,
  height = 30,
  width = 30,
  isError,
  src,
}: TokenImageProps & Partial<TokenImageWithAddressAndChainId> & Partial<TokenImageWithSrc>) => {
  if (address && chainId) {
    if (!ethers.isAddress(address)) {
      return <Image className={className} src={isError ? errorTokenIcon : tokenIcon} alt='token-icon' width={width} height={height} />
    }
    return <TokenImageWithAddressAndChainId isError={isError} address={address} chainId={chainId} className={className} height={height} width={width} />
  }
  return <Image className={className} src={src || (isError ? errorTokenIcon : tokenIcon)} alt='token-icon' width={width} height={height} />
}

const TokenImageWithAddressAndChainId = ({ address, chainId, isError, ...rest }: TokenImageProps & TokenImageWithAddressAndChainId) => {
  const { token } = useToken(address, chainId)
  return <Image src={token?.icon || (isError ? errorTokenIcon : tokenIcon)} alt={token?.symbol || 'token-icon'} {...rest} />
}

export default TokenImage
