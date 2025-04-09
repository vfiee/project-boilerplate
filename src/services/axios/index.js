import { useEnvStore } from '@/stores'
import { getUrlParams } from '@/utils'
import { useAxios as vueUseAxios } from '@vyron/use-axios'
import axios from 'axios'
import { merge } from 'lodash-es'

const { DEV, APP_ENV } = import.meta.env

const { access_token } = getUrlParams()

export const isTest = APP_ENV === 'test'

const instance = axios.create({
  timeout: 30000,
  adapter: 'fetch',
  timeoutErrorMessage: '请求超时',
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
  config.headers = merge({}, config.headers, { Authorization: access_token })
  return config
})

export function useAxios(url, config, options) {
  return vueUseAxios(url, config, instance, {
    immediate: false,
    resetOnExecute: true,
    ...(options || {})
  })
}
