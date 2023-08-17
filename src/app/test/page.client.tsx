'use client'
import useAuth from '@/hooks/core/useAuth'
import KaikasService from '@/services/kaikas'

const TestClient = () => {
  const { userAddress } = useAuth()
  const test = async () => {
    if (userAddress) {
      const res = await KaikasService.sendTransaction({
        to: '0xDF61031025A0f177314c10eB4bddF35B9E9bddd0',
        value: '1000000000000000000',
      })

      console.log(res)
    }
  }

  return (
    <div>
      <button onClick={() => test()}>test</button>
    </div>
  )
}

export default TestClient
