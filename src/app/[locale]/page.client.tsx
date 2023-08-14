'use client'

import PrimaryButton from '@/components/UI/Button/Primary'
import { ModalContext } from '@/providers/UI/Modal'
import { useContext } from 'react'

export default function HomeClient() {
  const { open, close } = useContext(ModalContext)
  return <main></main>
}
