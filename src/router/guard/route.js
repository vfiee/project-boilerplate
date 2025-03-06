import { useAuthStore, useRouterStore, useTabStore } from '@/stores'
import { isEmpty } from 'lodash-es'
import router from '..'

export function createRouteGuard(router) {
  router.beforeEach(async (to, from, next) => {
    const {
      path,
      meta: { needLogin = true, roles = [], href }
    } = to
    const location = await initRoute(to)
    if (location) {
      next(location)
      return
    }
    const rootRoutePath = '/'
    const loginRoutePath = '/login'
    const noAuthorizationRoutePath = '/403'
    const authStore = useAuthStore()
    const isLogin = authStore.isLogin

    const hasRole = authStore.roles.some((role) => roles.includes(role))
    const hasAuth = isEmpty(roles) || hasRole
    if (path === loginRoutePath && isLogin) {
      next({ path: rootRoutePath })
      return
    }

    if (needLogin && !isLogin) {
      next({ path: loginRoutePath, replace: true })
      return
    }

    if (!hasAuth) {
      next({ path: noAuthorizationRoutePath })
      return
    }

    if (href) {
      window.open(href, '__blank')
      next({
        path: from.fullPath,
        replace: true,
        query: from.query,
        hash: to.hash
      })
      return
    }

    next()
  })
}

function getRouteName(routePath) {
  const routes = router.getRoutes()
  const route = routes.find((route) => route.path === routePath)
  return route?.name
}

async function initRoute(route) {
  const routerStore = useRouterStore()
  const authStore = useAuthStore()
  const tabStore = useTabStore()
  await routerStore.initRoutes()
  tabStore.initHomeTab()
  const isNotFound = route.name === 'not-found'
  if (isNotFound) {
    const routeName = getRouteName(route.path)
    const isExitRoute = router.hasRoute(routeName)
    const targetPath = isExitRoute ? route.fullPath : '/index'
    return {
      replace: true,
      query: route.query,
      hash: route.hash,
      path: authStore.isLogin ? targetPath : '/login'
    }
  }
}
