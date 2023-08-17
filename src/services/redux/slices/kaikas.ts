import { PayloadAction, createSlice } from '@reduxjs/toolkit'

type KaikasState = {
  address: string
  chainId: number
} | null

const initialState: KaikasState = null as KaikasState

const kaikasSlice = createSlice({
  name: 'kaikas',
  initialState,
  reducers: {
    setKaikas: (_, action: PayloadAction<KaikasState>) => {
      return action.payload
    },
  },
})

export const { setKaikas } = kaikasSlice.actions

const KaikasReducer = kaikasSlice.reducer

export default KaikasReducer
