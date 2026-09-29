import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'
import {
	persistStore,
	persistReducer,
	FLUSH,
	REHYDRATE,
	PAUSE,
	PERSIST,
	PURGE,
	REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import autoMergeLevel1 from 'redux-persist/lib/stateReconciler/autoMergeLevel1'
import type { PersistConfig } from 'redux-persist'

import errorReducer from './slices/error/store'
import notificationReducer from './slices/notification/store'
import configReducer, { mergeKeyboardCommands } from './slices/config/store'
import type { ConfigState } from './slices/config/store'

// Only user preferences survive a reload; session state (selected client, day…) does not
const configPersistConfig: PersistConfig<ConfigState> = {
	key: 'config',
	storage,
	whitelist: ['keyboardCommands', 'showMealsInTable'],
	// Merge saved shortcuts over the current defaults so newly added commands
	// get their default key instead of being undefined
	stateReconciler: (inbound, original, reduced, config) => {
		const merged = autoMergeLevel1(inbound, original, reduced, config)
		return {
			...merged,
			keyboardCommands: mergeKeyboardCommands(inbound?.keyboardCommands),
			showMealsInTable: Array.isArray(inbound?.showMealsInTable)
				? inbound.showMealsInTable
				: merged.showMealsInTable,
		}
	},
}

const rootReducer = combineReducers({
	error: errorReducer,
	notification: notificationReducer,
	config: persistReducer(configPersistConfig, configReducer),
})

export const store = configureStore({
	reducer: rootReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				// redux-persist dispatches non-serializable actions internally
				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
			},
		}),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export default store
