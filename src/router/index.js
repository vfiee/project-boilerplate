import { createRouter, createWebHistory } from 'vue-router'
import { createRouterGuard } from './guard'
import { constantRoutes, createRoutes } from './modules'

export const router = createRouter({
  history: createWebHistory(),
  routes: createRoutes(constantRoutes)
})

export async function setupRouter(app) {
  app.use(router)
  createRouterGuard(router)
  await router.isReady()
}

export default router
