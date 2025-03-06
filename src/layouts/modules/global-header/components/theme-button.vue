<script setup lang="ts">
import ButtonIcon from '@/components/buttonIcon/index.vue'
import { useThemeStore } from '@/stores'

defineOptions({
  name: 'ThemeButton'
})

const themeStore = useThemeStore()
</script>

<template>
  <ButtonIcon
    icon="majesticons:color-swatch-line"
    class="text-24px"
    tooltip-content="主题配置"
    trigger-parent
    @click="themeStore.toggleThemeDrawerVisible(true)"
  />
</template>

<style scoped></style>
