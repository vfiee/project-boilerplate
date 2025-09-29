import router from '@/router'
import { authRoutes, createRoutes } from '@/router/modules'
import { useToggle } from '@vueuse/core'
import { isEmpty } from 'lodash-es'
import { defineStore } from 'pinia'
import { computed, nextTick, ref } from 'vue'
import {
  getBreadcrumbsByRoute,
  getGlobalMenusByRoutes,
  getSelectedMenuKeyPathByKey
} from './share'

export const useRouterStore = defineStore('router', () => {
  const [isInitRoute, setIsInitRoute] = useToggle(false)

  // routes
  const routes = ref([])
  function addRoutes(routes) {
    routes.forEach((route) => router.addRoute(route))
  }
  async function initRoutes() {
    if (isInitRoute.value) return
    const routes = createRoutes()
    addRoutes(routes)
    initCachedRoutes(authRoutes)
    initGlobalMenus(authRoutes)
    setIsInitRoute(true)
  }

  // cached routes
  const cachedRoutes = ref([])
  const uncachedRoutes = ref([])
  function initCachedRoutes(routeList) {
    const cacheNames = []
    const getCachedRouteNames = (routes) => {
      routes.forEach((route) => {
        const { meta, name, children } = route || {}
        if (meta.keepAlive && name) {
          cacheNames.push(name)
        }
        if (!isEmpty(children)) {
          getCachedRouteNames(children)
        }
      })
    }
    getCachedRouteNames(routeList)
    cacheNames.values = cacheNames
  }

  async function resetRouteCached(path) {
    const routePath = path || router.currentRoute.value.path
    uncachedRoutes.value.push(routePath)
    await nextTick()
    uncachedRoutes.value = []
  }

  // menus
  const menus = ref([])

  function initGlobalMenus(routes) {
    menus.value = getGlobalMenusByRoutes(routes)
  }

  function getSelectedMenuKeyPath(selectedRouteKey) {
    return getSelectedMenuKeyPathByKey(selectedRouteKey, menus.value)
  }

  // breadcrumbs
  const breadcrumbs = computed(() =>
    getBreadcrumbsByRoute(router.currentRoute.value, menus.value)
  )

  return {
    menus,
    routes,
    initRoutes,
    cachedRoutes,
    uncachedRoutes,
    resetRouteCached,
    breadcrumbs,
    getSelectedMenuKeyPath
  }
})
