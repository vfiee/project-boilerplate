import "@/assets/styles/global.css"
import { setupRouter } from "@/router"
import { setupStore } from "@/stores"
import "virtual:uno.css"
import { createSSRApp } from "vue"
import App from "./App.vue"

export function createApp() {
	const app = createSSRApp(App)
	setupStore(app)
	setupRouter(app)
	return {
		app
	}
}
