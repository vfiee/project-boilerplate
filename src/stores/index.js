import { createPinia } from "pinia"
export * from "./modules/auth"
export * from "./modules/env"

export function setupStore(app) {
	const store = createPinia()
	app.use(store)
}
