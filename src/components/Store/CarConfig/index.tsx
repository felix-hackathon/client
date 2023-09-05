import McLarenP1Config from './McLarenP1Config'
import PorscheCarrareGTConfig from './PorscheCarrareGTConfig'

const CarConfig = ({ slug }: { slug: string }) => {
  if (slug === 'mc-laren-p1') {
    return <McLarenP1Config slug={slug} />
  } else if (slug === 'porsche-carrare-gt') {
    return <PorscheCarrareGTConfig slug={slug} />
  }
  return <></>
}

export default CarConfig
