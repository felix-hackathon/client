import { PayloadAction, createSlice } from '@reduxjs/toolkit'

const initialState: number = parseInt(process.env.NEXT_PUBLIC_DEFAULT_CHAIN || '1001')

const chain = createSlice({
  name: 'chain',
  initialState,
  reducers: {
    setChain: (_, action: PayloadAction<number>) => {
      return action.payload
    },
  },
})

export const { setChain } = chain.actions

const ChainReducer = chain.reducer

export default ChainReducer
