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

const NotSupported = styled.div`
  display: none;
  @media screen and (max-width: 768px) {
    display: flex;
    position: fixed;
    z-index: 1000;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    background-color: black;
    font-size: 30px;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
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
      <NotSupported>This device is not supported </NotSupported>
    </Container>
  )
}
