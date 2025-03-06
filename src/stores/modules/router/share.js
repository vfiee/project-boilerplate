import { Icon } from '@iconify/vue'
import { h } from 'vue'

export function getGlobalMenusByRoutes(routes) {
  const menus = []

  routes.forEach((route) => {
    if (!route.meta?.hideInMenu) {
      const menu = getGlobalMenuByBaseRoute(route)
      if (route.children?.some((child) => !child.meta?.hideInMenu)) {
        menu.children = getGlobalMenusByRoutes(route.children)
      }
      menus.push(menu)
    }
  })

  return menus
}

function getGlobalMenuByBaseRoute(route) {
  const { name, path } = route
  const { label, title, icon, iconFontSize } = route.meta ?? {}
  const size = iconFontSize || 20
  return {
    title,
    label: label || title,
    icon: () => h(Icon, { icon, width: size, height: size }),
    key: name,
    routeKey: name,
    routePath: path
  }
}

export function getBreadcrumbsByRoute(route, menus) {
  const menuKey = route.name

  for (const menu of menus) {
    if (menu.key === menuKey) {
      return [menu]
    }

    if (menu.children?.length) {
      const result = getBreadcrumbsByRoute(route, menu.children)
      if (result.length > 0) {
        return [menu, ...result]
      }
    }
  }

  return []
}

export function getSelectedMenuKeyPathByKey(selectedKey, menus) {
  const keyPath = []

  menus.some((menu) => {
    const path = findMenuPath(selectedKey, menu)

    const find = Boolean(path?.length)

    if (find) {
      keyPath.push(...path)
    }

    return find
  })

  return keyPath
}

function findMenuPath(targetKey, menu) {
  const path = []

  function dfs(item) {
    path.push(item.key)
    if (item.key === targetKey) {
      return true
    }
    if (item.children) {
      for (const child of item.children) {
        if (dfs(child)) {
          return true
        }
      }
    }
    path.pop()
    return false
  }
  if (dfs(menu)) {
    return path
  }
  return null
}
