import React from 'react'
import LottieLoader from 'react-lottie-loader'
import { css, styled } from 'styled-components'
import loading from '@/assets/lottie/loading.json'
const Container = styled.div<any>`
  width: ${(props) => props.$size};
  height: ${(props) => props.$size};
`

const Wrapper = styled.div<any>`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  ${(props) =>
    props.height &&
    css`
      height: ${props.height};
    `}
`

export type LoadingProps = {
  size?: string
  wrapper?:
    | boolean
    | {
        height?: string
      }
} & React.HTMLAttributes<HTMLDivElement>

const Loading = (props: LoadingProps) => {
  const { size = '30px', wrapper = false, ...rest } = props
  if (wrapper) {
    return (
      <Wrapper height={typeof wrapper === 'boolean' ? null : wrapper?.height}>
        <Container $size={size} {...rest}>
          <LottieLoader animationData={loading} style={{ width: '100%', height: '100%' }} />
        </Container>
      </Wrapper>
    )
  }
  return (
    <Container $size={size} {...rest}>
      <LottieLoader animationData={loading} style={{ width: '100%', height: '100%' }} />
    </Container>
  )
}

export default Loading
