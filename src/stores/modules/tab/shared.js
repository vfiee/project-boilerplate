import router from '@/router'
import { filter, find, map } from 'lodash-es'

export function extractTabsByAllRoutes(router, tabs) {
  const routes = router.getRoutes()

  const routeNames = routes.map((route) => route.name)

  return tabs.filter((tab) => routeNames.includes(tab.routeKey))
}

export function getTabIdByRoute(route) {
  const { path, fullPath, meta } = route
  return meta.multipleTab ? fullPath : path
}

export function getTabByRoute(route) {
  const { name, path, fullPath = path, meta } = route
  const { title, fixedIndexInTab, icon } = meta

  return {
    icon,
    fullPath,
    label: title,
    routeKey: name,
    routePath: path,
    id: getTabIdByRoute(route),
    fixedIndex: fixedIndexInTab
  }
}

export function isTabInTabs(tabId, tabs) {
  return tabs.some((tab) => tab.id === tabId)
}

export function filterTabsById(tabId, tabs) {
  return tabs.filter((tab) => tab.id !== tabId)
}

export function findTabByRouteName(routeName, tabs) {
  const routes = router.getRoutes()
  const route = find(routes, { name: routeName })
  if (!route) return
  const isMultipleTab = get(route, 'meta.multipleTab')

  return find(tabs, { id: isMultipleTab ? route.fullPath : route.path })
}

export function getFixedTabs(tabs) {
  return filter(tabs, (tab) => tab.fixedIndex !== undefined)
}

export function getFixedTabIds(tabs) {
  return map(getFixedTabs(tabs), (tab) => tab.id)
}

export function getRouteByName(routeName) {
  const routes = router.getRoutes()
  return find(routes, { name: routeName })
}

export function getDefaultHomeTab(homeRouteName = 'home') {
  const routes = router.getRoutes()
  const homeRoute = routes.find((route) => route.name === homeRouteName)
  if (!homeRoute) return
  return getTabByRoute(homeRoute)
}

function isFixedTab(tab) {
  return tab.fixedIndex !== undefined && tab.fixedIndex !== null
}

function updateTabsLabel(tabs) {
  return tabs.map((tab) => ({
    ...tab,
    label: tab.newLabel || tab.oldLabel || tab.label
  }))
}

export function getAllTabs(tabs, homeTab) {
  if (!homeTab) {
    return []
  }

  const filterHomeTabs = tabs.filter((tab) => tab.id !== homeTab.id)

  const fixedTabs = filterHomeTabs
    .filter(isFixedTab)
    .sort((a, b) => a.fixedIndex - b.fixedIndex)

  const remainTabs = filterHomeTabs.filter((tab) => !isFixedTab(tab))

  const allTabs = [homeTab, ...fixedTabs, ...remainTabs]

  return updateTabsLabel(allTabs)
}
