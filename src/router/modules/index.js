import LayoutBase from '@/layouts/base/index.vue'
import LayoutBlank from '@/layouts/blank/index.vue'
import { cloneDeep, get, isEmpty, map } from 'lodash-es'
import documentRoutes from './document'
import homeRoutes from './home'

const views = import.meta.glob(`../../views/**/*.vue`)

export const authRoutes = [...homeRoutes, ...documentRoutes]

export const constantRoutes = [
  {
    path: '/',
    name: 'root',
    redirect: '/index',
    meta: {
      title: 'root'
    }
  },
  {
    path: '/login',
    layout: 'blank',
    name: 'login',
    component: 'login.index',
    meta: {
      title: '登录',
      needLogin: false
    }
  },
  {
    name: 'not-found',
    path: '/:pathMatch(.*)*',
    layout: 'base',
    component: 'exception.404.index',
    meta: {
      title: '404'
    }
  }
]

export function createRoutes(routes = cloneDeep(authRoutes)) {
  return map(routes, (route) => {
    let { layout, component, children, name } = route
    const getLayout = () =>
      get({ base: LayoutBase, blank: LayoutBlank }, layout)
    const getComponent = () => {
      if (!component) return
      const componentPath = [
        '../../views/',
        component.replaceAll('.', '/'),
        '.vue'
      ].join('')
      return get(views, componentPath)
    }
    if (!isEmpty(children)) {
      route.children = createRoutes(children)
    }
    if (layout) {
      route.component = getLayout()
      delete route.layout
      if (component) {
        delete route.name
        route.children = [
          {
            path: '',
            name,
            meta: route.meta,
            component: getComponent()
          }
        ]
      }
    } else if (component) {
      route.component = getComponent()
    }
    return route
  })
}
