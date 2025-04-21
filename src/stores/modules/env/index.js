import { envs as envConfig } from '@/config'
import { setStorage } from '@/utils'
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
  const targetEnv = APP_ENV || 'production'
  const envIndex = configs.findIndex((item) => item.env === targetEnv)
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
