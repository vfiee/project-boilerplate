<script setup>
import AppProvider from '@/components/appProvider/index.vue'
import { isTest, useAxios } from '@/services'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import { get } from 'lodash-es'
import { onMounted } from 'vue'
import Index from './index.vue'

defineOptions({
  name: 'APP'
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
