import { styled } from 'styled-components'

const Container = styled.div`
  width: 100%;
  margin-top: 10px;
  display: flex;
  gap: 10px;
`

const NFTContainer = styled.div`
  width: 200px;
  position: relative;
  border-radius: 10px;
  background-color: #fff;
`

const NFTImage = styled.img`
  width: 100%;
  aspect-ratio: 1;
  border-radius: 10px;
`

const NFTName = styled.h3`
  padding: 0px 10px;
  font-weight: 400;
  font-size: 14px;
`

const NFTId = styled.h4`
  padding: 0px 10px 10px 10px;
  font-weight: 400;
  font-size: 12px;
`

const Items = ({ data }: { data?: any }) => {
  return (
    <Container>
      {data?.items?.map((item: any) => (
        <NFTContainer key={item._id}>
          <NFTImage src={item.image} alt={item?.name} />
          <NFTName>{item?.name}</NFTName>
          <NFTId>#{item?.nftId}</NFTId>
        </NFTContainer>
      ))}
    </Container>
  )
}

export default Items
