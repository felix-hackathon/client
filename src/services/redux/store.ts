import { configureStore } from '@reduxjs/toolkit'
import UserReducer from './slices/user'
import ChainReducer from './slices/chain'

export const Store = configureStore({
  reducer: {
    user: UserReducer,
    chain: ChainReducer,
  },
  devTools: process.env.NEXT_PUBLIC_APP_MODE === 'development',
})

export type RootState = ReturnType<typeof Store.getState>
export type AppDispatch = typeof Store.dispatch
