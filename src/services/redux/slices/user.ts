import CookieService, { CookieKeys } from '@/services/cookie'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

type UserState = {
  address: string
  name: string
  email: string
  avatar: string
  isSigned: boolean
} | null

const initialState: UserState = null as UserState

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (_, action: PayloadAction<UserState>) => {
      if (action.payload) {
        CookieService.set(CookieKeys.ActiveUser, action.payload.address)
      } else {
        CookieService.remove(CookieKeys.ActiveUser)
      }
      return action.payload
    },
  },
})

export const { setUser } = userSlice.actions

const UserReducer = userSlice.reducer

export default UserReducer
