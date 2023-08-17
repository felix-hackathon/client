'use client'
import { styled } from 'styled-components'
import Aos from 'aos'
import { useEffect } from 'react'
import Header from './header'

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  max-height: -webkit-fill-available;
  background-color: #f2f2f2;
  overflow: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      require('aos/dist/aos.css')
      Aos.init()
    }
  }, [])
  return (
    <Container>
      <Header />
      {children}
    </Container>
  )
}
