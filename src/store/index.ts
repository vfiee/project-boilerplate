import { createPinia } from "pinia"
import { createPersistedState } from "pinia-plugin-persistedstate"
import { type App } from "vue"

export * from "./modules/auth"
export * from "./modules/env"

export function setupStore(app: App) {
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
