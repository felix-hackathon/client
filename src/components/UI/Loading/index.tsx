import React from 'react'
import LottieLoader from 'react-lottie-loader'
import { styled } from 'styled-components'
import loading from '@/assets/lottie/loading.json'
const Container = styled.div<any>`
  width: ${(props) => props.$size};
  height: ${(props) => props.$size};
`

export type LoadingProps = {
  size?: string
} & React.HTMLAttributes<HTMLDivElement>

const Loading = (props: LoadingProps) => {
  const { size = '30px', ...rest } = props
  return (
    <Container
      $size={size}
      {...rest}>
      <LottieLoader
        animationData={loading}
        style={{ width: '100%', height: '100%' }}
      />
    </Container>
  )
}

export default Loading
