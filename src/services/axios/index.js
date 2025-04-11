import { useEnvStore } from '@/stores'
import { getUrlParams } from '@/utils'
import { useAxios as vueUseAxios } from '@vyron/use-axios'
import axios from 'axios'
import { get, merge } from 'lodash-es'

const { DEV, APP_ENV } = import.meta.env

const { access_token } = getUrlParams()

export const isTest = APP_ENV === 'test'

const instance = axios.create({
  timeout: 30000,
  adapter: 'fetch',
  timeoutErrorMessage: '请求超时',
  responseType: 'json',
  headers: {
    'Content-Type': 'application/json'
  }
})

instance.interceptors.request.use((config) => {
  const { module: requestModule = 'common' } = config || {}
  const envStore = useEnvStore()
  const { modules } = envStore.currentEnv || {}
  const { proxyPrefix, url } = modules[requestModule] || {}
  config.baseURL = DEV ? `/${proxyPrefix}` : url
  config.headers = merge({}, config.headers, {
    Authorization: `Bearer ${access_token}`
  })
  return config
})

instance.interceptors.response.use((response) => {
  const skipResponseInterceptor = !get(
    response,
    'config.interceptors.response',
    true
  )
  if (skipResponseInterceptor) return response
  const data = get(response, 'data') || {}
  const { code, msg } = data
  if (+code == 200) {
    return data
  }
  window.$message.error(msg || '请求发生错误')
  return Promise.reject(response)
})

export function useAxios(url, config, options) {
  return vueUseAxios(url, config, instance, {
    immediate: false,
    resetOnExecute: true,
    ...(options || {})
  })
}
