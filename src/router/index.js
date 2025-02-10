import { setDocumentTitle } from "@/utils"
import { get } from "lodash-es"
import { createRouter, createWebHistory } from "vue-router"
import routes from "./modules"

const router = createRouter({
	routes,
	history: createWebHistory()
})

router.beforeEach((to, _, next) => {
	setDocumentTitle(get(to, "meta.title"))
	next()
})

export default router
