export default [
  {
    path: '/document',
    layout: 'base',
    name: 'document',
    redirect: '/document/vue',
    meta: {
      title: '文档',
      needLogin: true,
      icon: 'mdi:file-document-multiple-outline'
    },
    children: [
      {
        path: '/document/vue',
        name: 'document_vue',
        component: 'iframe.index',
        props: {
          url: 'https://vuejs.org/'
        },
        meta: {
          title: 'Vue 文档',
          needLogin: true,
          icon: 'logos:vue'
        }
      },
      {
        path: '/document/ant-design-vue',
        name: 'document_ant_design_vue',
        component: 'iframe.index',
        props: {
          url: 'https://www.antdv.com/components/overview-cn'
        },
        meta: {
          title: 'Ant Design Vue文档',
          needLogin: true,
          icon: 'logos:ant-design'
        }
      },
      {
        path: '/document/mdn',
        name: 'document_mdn',
        component: 'iframe.index',
        meta: {
          title: 'MDN 文档',
          needLogin: true,
          icon: 'logos:mdn',
          href: 'https://developer.mozilla.org/zh-CN/docs/Web/JavaScript'
        }
      }
    ]
  }
]
