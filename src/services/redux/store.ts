import { configureStore } from '@reduxjs/toolkit'
import UserReducer from './slices/user'

export const Store = configureStore({
  reducer: {
    user: UserReducer,
  },
  devTools: process.env.NEXT_PUBLIC_APP_MODE === 'development',
})

export type RootState = ReturnType<typeof Store.getState>
export type AppDispatch = typeof Store.dispatch
