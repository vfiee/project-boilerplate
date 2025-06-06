import { createRouter, createWebHashHistory } from "vue-router"
import { createRouterGuard } from "./guard"
import routes from "./modules"

export const router = createRouter({
	routes,
	history: createWebHashHistory()
})

export async function setupRouter(app) {
	app.use(router)
	createRouterGuard(router)
	await router.isReady()
}

export default router
