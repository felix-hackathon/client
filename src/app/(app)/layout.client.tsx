'use client'
import { styled } from 'styled-components'
import Aos from 'aos'
import { useEffect } from 'react'
import Header from './header'
import useKaikasReconnect from '@/hooks/kaikas/useKaikasReconnect'
import useWatchNetwork from '@/hooks/kaikas/useWatchNetwork'
import { useSelectedLayoutSegments } from 'next/navigation'

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  max-height: -webkit-fill-available;
  background-color: #f2f2f2;
  overflow: scroll;
  /* &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none; */
`

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  useKaikasReconnect()
  useWatchNetwork()
  const allSegments = useSelectedLayoutSegments()
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      require('aos/dist/aos.css')
      Aos.init()
    }
  }, [])

  if (allSegments.includes('store')) {
    return <>{children}</>
  }
  return (
    <Container>
      <Header />
      {children}
    </Container>
  )
}
