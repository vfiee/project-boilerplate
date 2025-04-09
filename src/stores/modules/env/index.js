import { envs as envConfig } from '@/config'
import { getStorage, setStorage } from '@/utils'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

const { APP_ENV } = import.meta.env

const CURRENT_STORAGE_ENV_KEY = `ENV_CONFIG_CURRENT_ENV_KEY`

function setActiveEnv(envs, index) {
  for (let i = 0; i < envs.length; i++) {
    envs[i].active = i === index
    setStorage(CURRENT_STORAGE_ENV_KEY, envs[index])
  }
  return envs
}

function getEnvs(configs) {
  // 1. 查看本地缓存是否有当前环境,如果有对比配置是否发生改变
  // 2. 本地没有缓存,查看用户传入的配置是否有设置active
  // 3. 用户没有设置当前环境, 根据环境变量(process.env.NODE_ENV)匹配当前的环境
  const storageEnv = getStorage(CURRENT_STORAGE_ENV_KEY)
  if (storageEnv) {
    const index = configs.findIndex((config) => config.env === storageEnv.env)
    if (JSON.stringify(storageEnv) === JSON.stringify(configs[index])) {
      return storageEnv
    }
    return setActiveEnv(configs, index)
  }
  const activeIndex = configs.findIndex((config) => !!config.active)
  if (activeIndex !== -1) {
    return setActiveEnv(configs, activeIndex)
  }
  const envIndex = configs.findIndex(
    (config) => config.env === APP_ENV || 'production'
  )
  return setActiveEnv(configs, envIndex)
}

export const useEnvStore = defineStore('env', () => {
  const visible = ref(false)
  const envs = ref(getEnvs(envConfig))

  const show = () => (visible.value = true)
  const hide = () => (visible.value = false)
  const toggle = () => (visible.value = !visible.value)

  const setCurrentEnv = (env) => {
    envs.value.forEach((item) => {
      item.active = item.env === env.env
    })
    setStorage(CURRENT_STORAGE_ENV_KEY, env)
  }
  const setCurrentEnvByIndex = (index) => {
    const envConfig = envs.value[index]
    if (!envConfig) return
    setCurrentEnv(envConfig)
  }
  const currentEnv = computed(() => {
    return envs.value.filter((item) => item.active)?.[0]
  })
  const mapColumns = computed(() => {
    return envs.value.map((env) => ({
      ...env,
      className: env.active ? 'text-[#2dd4bf] font-bold' : ''
    }))
  })
  const getCurrentEnvModule = (moduleName = 'common') => {
    return currentEnv.value.modules?.[moduleName]
  }
  return {
    visible,
    envs,
    show,
    hide,
    toggle,
    currentEnv,
    mapColumns,
    setCurrentEnv,
    getCurrentEnvModule,
    setCurrentEnvByIndex
  }
})
export default useEnvStore
