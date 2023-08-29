import { styled } from 'styled-components'

const Container = styled.div`
  position: fixed;
  left: 10px;
  top: 50px;
  z-index: 10;
  color: #bdbdbd;
  font-size: 10px;
  width: 100%;
  pointer-events: none;
  div {
    position: absolute;
    bottom: 100%;
    transform: rotateZ(90deg);
    width: calc(100vh - 80px);
    transform-origin: 0 100%;
    white-space: nowrap;
    marquee {
      transform: rotate(180deg);
    }
  }
`

const License = ({ slug }: { slug: string }) => {
  return (
    <Container>
      <div>
        {/** @ts-ignore */}
        <marquee>
          {slug === 'mc-laren-p1'
            ? 'This work is based on "AC - Mclaren P1" (https://sketchfab.com/3d-models/ac-mclaren-p1-747cedadc302451db61deafc85941395) by DAVID 3D ART (https://sketchfab.com/david3dart) licensed under CC-BY-NC-4.0 (http://creativecommons.org/licenses/by-nc/4.0/)'
            : 'This work is based on "Porsche Carrera GT 2003 Street" (https://sketchfab.com/3d-models/porsche-carrera-gt-2003-street-1880cd019d6f4bc2a8aec8a220bd5f0c) by Pitstop 3D - Euro (https://sketchfab.com/carfan100) licensed under CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)'}
          {/** @ts-ignore */}
        </marquee>
      </div>
    </Container>
  )
}

export default License
