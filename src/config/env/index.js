import { map } from 'lodash-es'

export const envs = [
  {
    env: 'test',
    name: '测试环境',
    modules: {
      common: {
        proxyPrefix: 'book-test',
        url: 'https://test-book.xxx.com'
      },
      login: {
        proxyPrefix: 'login-test',
        url: 'https://test-login.xxx.com'
      }
    }
  },
  {
    env: 'production',
    name: '正式环境',
    modules: {
      common: {
        proxyPrefix: 'book',
        url: 'https://book.xxx.com'
      },
      login: {
        proxyPrefix: 'login',
        url: 'https://login.xxx.com'
      }
    }
  }
]

export const getProxyConfig = () => {
  return map(envs, (config) => Object.values(config.modules))
    .flat()
    .reduce((acc, { proxyPrefix, url } = {}) => {
      acc[`/${proxyPrefix}`] = {
        target: url,
        secure: false,
        changeOrigin: true,
        headers: { Referer: url },
        rewrite: (path) => path.replace(new RegExp(`^/${proxyPrefix}`), '')
      }
      return acc
    }, {})
}
