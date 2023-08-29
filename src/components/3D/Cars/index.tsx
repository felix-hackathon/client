import McLarenP1 from '../McLaren/P1'
import CarrareGT from '../Porsche/CarrareGT'

const Cars = ({ slug }: { slug: string }) => {
  if (slug === 'mc-laren-p1') {
    return <McLarenP1 />
  }
  if (slug === 'porsche-carrare-gt') {
    return <CarrareGT />
  }
  return <></>
}

export default Cars
