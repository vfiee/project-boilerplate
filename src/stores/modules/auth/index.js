import { STORAGE_USERINFO_KEY } from '@/config'
import router from '@/router'
import { getStorage } from '@/utils'
import { get, merge } from 'lodash-es'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const userInfo = ref(
    getStorage(STORAGE_USERINFO_KEY)
  )

  // getters
  const roles = computed(() => get(userInfo.value, 'roles', []))
  const isLogin = computed(() => !!get(userInfo.value, 'token'))
  const useHeaders = computed(() => {
    return {
      token: isLogin.value ? `Bearer ${userInfo.value.token}` : ''
    }
  })
  const update = (updateUserinfo) => {
    userInfo.value = merge(userInfo.value, updateUserinfo)
  }
  const remove = () => (userInfo.value = undefined)

  const logout = () => {
    remove()
    router.replace('/login')
  }
  return {
    userInfo,
    roles,
    isLogin,
    useHeaders,
    update,
    remove,
    logout
  }
})
