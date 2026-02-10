import { useDispatch, useSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/auth/store'
import errorReducer from './slices/error/store'
import { useAuth } from './slices/auth/hook'
import { useError } from './slices/error/hook'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    error: errorReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export { useAuth, useError }