import { configureStore } from '@reduxjs/toolkit'
import UserReducer from './slices/user'
import KaikasReducer from './slices/kaikas'

export const Store = configureStore({
  reducer: {
    user: UserReducer,
    kaikas: KaikasReducer,
  },
  devTools: process.env.NEXT_PUBLIC_APP_MODE === 'development',
})

export type RootState = ReturnType<typeof Store.getState>
export type AppDispatch = typeof Store.dispatch
