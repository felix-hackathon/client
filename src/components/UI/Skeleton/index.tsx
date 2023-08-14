import React from 'react'
import { keyframes, styled } from 'styled-components'

const shine = keyframes`
  to {
    background-position-x: -200%;
  }
`

const Container = styled.div`
  width: 100%;
  div {
    background: #eee;
    background: linear-gradient(110deg, #ececec 8%, #f5f5f5 18%, #ececec 33%);
    border-radius: 5px;
    background-size: 200% 100%;
    animation: 1.5s ${shine} linear infinite;
  }
`

const Skeleton = ({ children }: { children: React.ReactNode }) => {
  return <Container>{children}</Container>
}

Skeleton.Text = ({ height = '25px', width = '250px' }: { height?: string; width?: string }) => {
  return <div style={{ width, height }} />
}

export default Skeleton
