<script setup>
import PickerEnv from '@/components/pickerEnv/index.vue'
import { envs } from '@/config'
import ZH_CN from 'ant-design-vue/es/locale/zh_CN'
import { computed } from 'vue'
import { useThemeStore } from './stores'

defineOptions({
  name: 'APP'
})

const themeStore = useThemeStore()

const watermarkProps = computed(() => {
  return {
    content: themeStore.watermark.text,
    width: 120,
    height: 120,
    font: { fontSize: 16 },
    offset: [12, 60],
    rotate: -15,
    zIndex: 9999
  }
})
</script>

<template>
  <a-config-provider :theme="themeStore.antdTheme" :locale="ZH_CN">
    <AppProvider>
      <router-view class="bg-layout" />
      <a-watermark
        v-if="themeStore.watermark.visible"
        v-bind="watermarkProps"
        class="pointer-events-none absolute-lt! size-full"
      />
      <PickerEnv :envs="envs" />
    </AppProvider>
  </a-config-provider>
</template>

<style>
@import url('@/assets/styles/global.css');
</style>
