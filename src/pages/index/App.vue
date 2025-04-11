<script setup>
import AppProvider from '@/components/appProvider/index.vue'
import { isTest, useAxios } from '@/services'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import { get } from 'lodash-es'
import { onMounted } from 'vue'
import Index from './index.vue'
import { useCallStore } from './stores'

defineOptions({
  name: 'APP'
})

const callStore = useCallStore()

const load = async () => {
  await callStore.loadUser()
  const { data, execute } = useAxios(
    `/rest/sc/v1.0/callcenter/getSeatPhoneByUserId?userId=${callStore.user.id}`,
    { module: 'crm', method: 'GET', interceptors: { response: false } }
  )
  await execute()
  const { callCenterAccount, callCenterLoginPass } =
    get(data.value, 'data') || {}
  if (isTest) {
    callStore.account = '8008@xuwj'
    callStore.password = 'FOid9144@'
  } else {
    callStore.account = callCenterAccount
    callStore.password = callCenterLoginPass
  }
  callStore.loaded = true
}

onMounted(() => {
  load()
})
</script>

<template>
  <a-config-provider :locale="zhCN">
    <AppProvider>
      <Index class="bg-layout" />
    </AppProvider>
  </a-config-provider>
</template>

<style>
@import url('@/assets/styles/global.css');
</style>
