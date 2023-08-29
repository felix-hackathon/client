import McLarenP1Config from './McLarenP1Config'
import PorscheCarrareGTConfig from './PorscheCarrareGTConfig'

const CarConfig = ({ slug }: { slug: string }) => {
  if (slug === 'mc-laren-p1') {
    return <McLarenP1Config />
  } else if (slug === 'porsche-carrare-gt') {
    return <PorscheCarrareGTConfig />
  }
  return <></>
}

export default CarConfig
