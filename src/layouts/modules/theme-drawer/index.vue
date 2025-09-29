<script setup>
import ButtonIcon from '@/components/buttonIcon/index.vue'
import { useThemeStore } from '@/stores'
import ConfigOperation from './modules/config-operation.vue'
import DarkMode from './modules/dark-mode.vue'
import LayoutMode from './modules/layout-mode.vue'
import PageFun from './modules/page-fun.vue'
import ThemeColor from './modules/theme-color.vue'

defineOptions({
  name: 'ThemeDrawer'
})

const themeStore = useThemeStore()
</script>

<template>
  <a-drawer
    :open="themeStore.themeDrawerVisible"
    title="主题配置"
    :closable="false"
    :body-style="{ padding: '0px' }"
    @close="themeStore.toggleThemeDrawerVisible(false)"
  >
    <template #extra>
      <ButtonIcon
        icon="ant-design:close-outlined"
        class="h-28px"
        @click="themeStore.toggleThemeDrawerVisible(false)"
      />
    </template>
    <div class="px-24px pb-24px pt-8px">
      <DarkMode />
      <LayoutMode />
      <ThemeColor />
      <PageFun />
    </div>
    <template #footer>
      <ConfigOperation />
    </template>
  </a-drawer>
</template>

<style scoped></style>
