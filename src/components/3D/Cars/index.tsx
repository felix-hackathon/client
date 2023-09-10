import { useContext } from 'react'
import McLarenP1 from '../McLaren/P1'
import CarrareGT from '../Porsche/CarrareGT'
import { CarContext } from '@/app/(app)/store/[slug]/page.client'

const Cars = ({ slug, config }: { slug: string; config?: any }) => {
  if (config) {
    if (slug === 'mc-laren-p1') {
      return <McLarenP1 config={config} />
    }
    if (slug === 'porsche-carrare-gt') {
      return <CarrareGT config={config} />
    }
    return <></>
  }
  return <CarsWithoutConfig slug={slug} />
}

const CarsWithoutConfig = ({ slug }: { slug: string }) => {
  const { config } = useContext(CarContext)
  if (slug === 'mc-laren-p1') {
    return <McLarenP1 config={config} />
  }
  if (slug === 'porsche-carrare-gt') {
    return <CarrareGT config={config} />
  }
  return <></>
}

export default Cars
