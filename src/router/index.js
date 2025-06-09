import routes from "uni-router-routes"
import { createRouter } from "uniapp-router-next"

const router = createRouter({
	routes,
	platform: process.env.UNI_PLATFORM
})

function hookRouterAlias(router) {
	return Object.assign(router, {
		push: router.navigate,
		pushTab: router.switchTab,
		replace: router.redirect,
		replaceAll: router.reLaunch,
		back: router.navigateBack
	})
}

export function setupRouter(app) {
	hookRouterAlias(router)
}

export default router
