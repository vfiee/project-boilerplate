export default [
  {
    path: '/index',
    layout: 'base',
    name: 'home',
    component: 'home.index',
    meta: {
      title: '首页',
      needLogin: true,
      icon: 'line-md:home'
    }
  },
  {
    path: '/exception',
    layout: 'base',
    name: 'exception',
    redirect: '/exception/403',
    meta: {
      title: '异常',
      needLogin: true,
      icon: 'iconamoon:cloud-error'
    },
    children: [
      {
        path: '/exception/403',
        name: 'no-permission',
        component: 'exception.403.index',
        meta: {
          title: '403',
          needLogin: true,
          icon: 'solar:forbidden-outline'
        }
      },
      {
        path: '/exception/404',
        name: 'no-found',
        component: 'exception.404.index',
        meta: {
          title: '404',
          needLogin: true,
          icon: 'tabler:error-404'
        }
      },
      {
        path: '/exception/500',
        name: 'server-error',
        component: 'exception.500.index',
        meta: {
          title: '500',
          needLogin: true,
          icon: 'tabler:server-off'
        }
      }
    ]
  }
]
