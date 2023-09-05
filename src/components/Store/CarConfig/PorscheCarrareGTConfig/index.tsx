import { Car, CarContext } from '@/app/store/[slug]/page.client'
import PrimaryButton from '@/components/UI/Button/Primary'
import { useContext } from 'react'
import { styled } from 'styled-components'

const InfoContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 30px 10px;
`

const Name = styled.h1`
  color: #fff;
  letter-spacing: 0.2rem;
`

const PriceContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 20px;
`

const Price = styled.p`
  margin: 0;
  font-size: 28px;
  color: #fff;
`

const Title = styled.h2`
  margin: 0;
  margin-top: 50px;
  color: #fff;
  font-weight: 400;
`

const OptionTitle = styled.h4`
  margin: 0;
  margin-top: 20px;
  color: #fff;
  font-weight: 400;
`

const OptionsContainer = styled.div`
  margin-top: 15px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
`

const OptionContainer = styled.div<any>`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 200px;
  height: 40px;
  background-color: ${(props) => (props.$active ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)')};
  border-radius: 10px;
  padding: 5px;
  cursor: pointer;
`

const Color = styled.div<any>`
  width: 30px;
  height: 30px;
  border-radius: 10px;
  background-color: ${(props) => props.$bg};
`

const OptionValue = styled.p`
  margin: 0px;
  color: #fff;
`

const PorscheCarrareGTConfig = ({ slug }: { slug: any }) => {
  const { config, onChangeConfig, setStep } = useContext(CarContext)
  const car = Car[slug]
  return (
    <InfoContainer>
      <div>
        <Name>{car.name}</Name>
        <PriceContainer>
          <Price>{car.price} KLAY</Price>
        </PriceContainer>
        <Title>Car options</Title>
        {car.attribute.map((ele) => (
          <>
            <OptionTitle>{ele.name}:</OptionTitle>
            <OptionsContainer>
              {ele.options.map((i) => (
                <OptionContainer $active={i.key === (config as any)[ele.key]} key={i.key} onClick={() => onChangeConfig(ele.key, i.key)}>
                  {i.icon && <Color $bg={i.icon} />}
                  <OptionValue>
                    {i.name} - ${i.price}
                  </OptionValue>
                </OptionContainer>
              ))}
            </OptionsContainer>
          </>
        ))}
      </div>
      <PrimaryButton onClick={() => setStep('buy')} width='300px' className='MT50 MB20'>
        Buy
      </PrimaryButton>
    </InfoContainer>
  )
}

export default PorscheCarrareGTConfig
