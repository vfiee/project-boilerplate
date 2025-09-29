export const envs = [
  {
    env: 'test',
    name: '测试环境',
    modules: {
      common: {
        proxyPrefix: 'test',
        url: 'https://api.xiaoshouyi.com'
      }
    }
  },
  {
    name: '正式环境',
    env: 'production',
    modules: {
      common: {
        enableProxy: false,
        proxyPrefix: 'prod',
        url: '/service/api/proxy?request='
      }
    }
  }
]
