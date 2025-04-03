import { setupRouter } from "@/router"
import { setupStore } from "@/stores"
import { Lazyload } from "vant"
import { createApp } from "vue"
import App from "./App.vue"
import {
	setupAppUpdate,
	setupDayjs,
	setupLoading,
	setupNProgress
} from "./plugins"

async function setupApp() {
	setupLoading()
	setupNProgress()
	setupDayjs()
	const app = createApp(App).use(Lazyload)
	setupStore(app)
	await setupRouter(app)
	setupAppUpdate(app)
	app.mount("#app")
}

setupApp()
