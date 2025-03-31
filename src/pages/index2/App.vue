<script setup>
import AppProvider from '@/components/appProvider/index.vue'
import ZH_CN from 'ant-design-vue/es/locale/zh_CN'
import Index from './views/index/index.vue'

defineOptions({
  name: 'APP'
})
</script>

<template>
  <a-config-provider :locale="ZH_CN">
    <AppProvider>
      <Index class="bg-layout" />
    </AppProvider>
  </a-config-provider>
</template>

<style>
@import url('@/assets/styles/global.css');
</style>
