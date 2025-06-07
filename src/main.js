import "@/assets/styles/global.css"
import router from "@/router"
import { setupStore } from "@/stores"
import "virtual:uno.css"
import { createSSRApp } from "vue"
import App from "./App.vue"

export function createApp() {
	const app = createSSRApp(App)
	setupStore(app)
	app.use(router)
	return {
		app
	}
}
