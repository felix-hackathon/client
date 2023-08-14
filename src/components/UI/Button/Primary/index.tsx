import dynamic from 'next/dynamic'
import { css, styled } from 'styled-components'
const Loading = dynamic(() => import('@/components/UI/Loading'))

const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Wrapper = styled.button<{
  $width?: string
  $height?: string
}>`
  display: flex;
  position: relative;
  width: 100%;
  border: none;
  max-width: ${(props) => props.$width};
  height: ${(props) => props.$height};
  padding: 10px 45px;
  color: transparent;
  background: #444;
  transition: transform 1s;
  box-shadow: 5px 5px 0 #222;
  transform: skewX(-10deg);
  user-select: none;
  span {
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    background: #444;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    ${(props) =>
      props.disabled &&
      css`
        color: rgba(255, 255, 255, 0.5);
        background-color: rgba(68, 68, 68, 0.9);
      `}
  }
  &:disabled {
    span {
      cursor: not-allowed;
    }
  }
  &:active:not(:disabled) {
    background-color: transparent;
    span {
      transform: translate(5px, 5px);
    }
  }
  ${(props) =>
    props.disabled &&
    css`
      background-color: transparent;
      box-shadow: none;
      span {
        transform: translate(5px, 5px);
      }
    `}
`

const LoadingContainer = styled.div`
  width: 100%;
  position: absolute;
  display: flex;
  justify-content: center;
`

export type PrimaryButtonProps = {
  width?: string
  height?: string
  disabled?: boolean
  loading?: boolean
  type?: 'submit' | 'button'
} & React.HTMLAttributes<HTMLDivElement>

const PrimaryButton = (props: PrimaryButtonProps) => {
  const { width = '100%', height = '50px', children, type = 'submit', disabled = false, loading = false, onClick = () => {}, ...rest } = props

  return (
    <Container {...rest}>
      <Wrapper type={type} disabled={disabled || loading} $width={width} $height={height} onClick={(e: any) => onClick(e)}>
        {children}
        <span>
          {children}
          {loading && (
            <LoadingContainer>
              <Loading />
            </LoadingContainer>
          )}
        </span>
      </Wrapper>
    </Container>
  )
}

export default PrimaryButton
