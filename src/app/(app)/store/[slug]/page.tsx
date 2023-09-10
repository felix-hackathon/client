import StoreDetailClient from './page.client'

const StoreDetail = ({ params: { slug } }: { params: { slug: string } }) => {
  if (!['porsche-carrare-gt', 'mc-laren-p1'].includes(slug)) {
    throw new Error('Page not found')
  }
  return <StoreDetailClient slug={slug} />
}

export default StoreDetail
