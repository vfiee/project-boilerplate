import "@/assets/styles/global.css"
import { setupStore } from "@/store"
import "virtual:uno.css"
import { createSSRApp } from "vue"
import App from "./App.vue"

export function createApp() {
	const app = createSSRApp(App)
	setupStore(app)
	return {
		app
	}
}
