<script setup>
import ColorPicker from '@/components/colorPicker/index.vue'
import { useThemeStore } from '@/stores'
import SettingItem from '../components/setting-item.vue'

defineOptions({
  name: 'ThemeColor'
})

const themeStore = useThemeStore()

function getThemeColorLabel(key) {
  const colorMap = {
    primary: '主色',
    info: '信息色',
    success: '成功色',
    warning: '警告色',
    error: '错误色'
  }
  return colorMap[key]
}

function handleUpdateColor(color, key) {
  themeStore.updateThemeColors(key, color)
}
</script>

<template>
  <a-divider>主题颜色</a-divider>
  <div class="flex-col-stretch gap-12px">
    <SettingItem
      v-for="(_, key) in themeStore.themeColors"
      :key="key"
      :label="getThemeColorLabel(key)"
    >
      <template v-if="key === 'info'" #suffix>
        <a-checkbox v-model:checked="themeStore.isInfoFollowPrimary">
          跟随主色
        </a-checkbox>
      </template>
      <ColorPicker
        :color="themeStore.themeColors[key]"
        :disabled="key === 'info' && themeStore.isInfoFollowPrimary"
        @update:color="handleUpdateColor($event, key)"
      />
    </SettingItem>
  </div>
</template>

<style scoped></style>
