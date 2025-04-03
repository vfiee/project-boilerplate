import { createRouter, createWebHistory } from "vue-router"
import { createRouterGuard } from "./guard"
import routes from "./modules"

export const router = createRouter({
	routes,
	history: createWebHistory()
})

export async function setupRouter(app) {
	app.use(router)
	createRouterGuard(router)
	await router.isReady()
}

export default router
