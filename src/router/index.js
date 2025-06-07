/// <reference types="@uni-helper/vite-plugin-uni-pages/client" />
import { isEmpty } from "lodash-es"
import { pages, subPackages } from "virtual:uni-pages"

function generateRoutes() {
	const routes = pages.map(page => ({ ...page, path: `/${page.path}` }))
	if (isEmpty(subPackages)) return routes
	subPackages.forEach(subPackage => {
		const subRoutes = subPackage.pages.map(page => ({
			...page,
			path: `/${subPackage.root}/${page.path}`
		}))
		routes.push(...subRoutes)
	})
	return routes
}

const router = createRouter({ routes: generateRoutes() })

router.beforeEach((to, from, next) => {
	console.log(`beforeEach to:`, to)
	console.log(`beforeEach from:`, from)
	next()
})

router.afterEach((to, from) => {
	console.log(`afterEach to:`, to)
	console.log(`afterEach from:`, from)
})

export default router
