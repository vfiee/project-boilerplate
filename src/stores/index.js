import { createPinia } from "pinia"
import { createPersistedState } from "pinia-plugin-persistedstate"

export * from "./modules/auth"
export * from "./modules/env"
export * from "./modules/theme"

export function setupStore(app) {
	const store = createPinia()
	store.use(
		createPersistedState({
			storage: {
				getItem: uni.getStorageSync,
				setItem: uni.setStorageSync
			}
		})
	)
	app.use(store)
}
