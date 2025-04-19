export const envs = [
  {
    env: 'test',
    name: '测试环境',
    modules: {
      common: {
        proxyPrefix: 'test',
        url: 'https://api-sandbox.xiaoshouyi.com'
      },
      crm: {
        proxyPrefix: 'crm',
        url: 'https://api-sandbox.xiaoshouyi.com'
      }
    }
  },
  {
    env: 'production',
    name: '正式环境',
    modules: {
      common: {
        proxyPrefix: 'prod',
        url: 'https://api.xiaoshouyi.com'
      },
      crm: {
        proxyPrefix: 'prod-crm',
        url: 'https://api.xiaoshouyi.com'
      }
    }
  }
]
