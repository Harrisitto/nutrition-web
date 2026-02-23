import { configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'

import authReducer from './slices/auth/store'
import errorReducer from './slices/error/store'
import notificationReducer from './slices/notification/store'
import configReducer from './slices/config/store'

// NOTE: Intentionally omit the `config` reducer per request

export const store = configureStore({
	reducer: {
		auth: authReducer,
		error: errorReducer,
		notification: notificationReducer,
		config: configReducer,
	},
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export default store
