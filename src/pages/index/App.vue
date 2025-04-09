<script setup>
import AppProvider from '@/components/appProvider/index.vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
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
