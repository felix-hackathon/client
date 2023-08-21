import { styled } from 'styled-components'
import selectWhiteIcon from '@/assets/icons/select-white.svg'
// import selectWhiteIcon from '@/assets/icons/select.svg'
import Image from 'next/image'
const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
  padding: 10px 15px;
  background-color: #444;
  color: #fff;
  max-width: 150px;
  cursor: pointer;
  transform: skewX(-5deg);
`

const SelectToken = () => {
  return (
    <Container>
      <div>Select</div>
      <Image src={selectWhiteIcon} alt='select' width={12} />
    </Container>
  )
}

export default SelectToken
