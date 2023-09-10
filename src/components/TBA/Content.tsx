import { useEffect, useState } from 'react'
import { css, styled } from 'styled-components'
import Image from 'next/image'
import Tabs from '../Tabs'
import { ellipsisAddress } from '@/common/functions'

const Container = styled.div<{ $mounted: boolean }>`
  background-color: #f2f2f2;
  width: 100%;
  height: 0px;
  border-radius: 30px 30px 0px 0px;
  padding: 0px 15px;
  cursor: default;
  transition: all 0.5s linear;
  ${(props) =>
    props.$mounted &&
    css`
      height: 90%;
      @media screen and (max-width: 768px) {
        height: 90%;
        border-radius: 10px 10px 0px 0px;
      }
    `}
`

const Top = styled.div`
  width: 100%;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`

const Line = styled.div`
  width: 50px;
  border-bottom: 3px solid #c9c9c9;
`

const NameContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const Name = styled.h1`
  color: #000;
  font-size: 30px;
  font-weight: 600;
`

const TBAAddress = styled.div<{ $copy?: boolean }>`
  height: 30px;
  width: 120px;
  padding: 5px 10px;
  color: #000;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: ${(props) => (props.$copy ? 'not-allowed' : 'pointer')};
  font-weight: 600;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
`

const Content = ({ data, onClose }: { data?: any; onClose?: any }) => {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  const [copy, setCopy] = useState(false)

  return (
    <Container $mounted={mounted} onClick={(e) => e.stopPropagation()}>
      <Top onClick={() => onClose && onClose()}>
        <Line />
      </Top>
      <NameContainer>
        <Name>MC Laren P1</Name>
        <TBAAddress
          $copy={copy}
          onClick={() => {
            if (!copy) {
              setCopy(true)
              setTimeout(() => setCopy(false), 1000)
            }
          }}
        >
          {copy ? (
            <Image
              alt='copy'
              width={20}
              height={20}
              src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAJZJREFUSEvtlEEOgCAMBJef6c/0Zfo0s4cmVYGuAje4GGIyQ7dNEwafNJiPKQgTnhH5iBYA5zOzXhEdACjYAWxe0kNgcL5+7V1BFU5ZSwUhPBIwy1uernwJXhOwYYTkcpXhUQU50Cd4JOB/D+TdZv01LaWdoTTZJGRkR7G2kBSBVcKv/HKTqoJwa7ZE9BuuNLkJPgVSfBfVkxoZraP1cAAAAABJRU5ErkJggg=='
            />
          ) : (
            ellipsisAddress(data?.tbaAddress || '', 4, 4)
          )}
        </TBAAddress>
      </NameContainer>

      <Tabs
        options={[
          {
            key: 'accessory',
            label: 'Accessory',
            component: <></>,
          },
        ]}
      />
    </Container>
  )
}

export default Content
