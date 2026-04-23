<script setup>
import AppProvider from '@/components/appProvider/index.vue';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import CollaborativeCustomer from './index.vue';

defineOptions({
  name: 'CollaborativeCustomerApp'
})
</script>

<template>
  <a-config-provider :locale="zhCN">
    <AppProvider>
      <CollaborativeCustomer />
    </AppProvider>
  </a-config-provider>
</template>

<style>
@import url('@/assets/styles/global.css');
</style>
