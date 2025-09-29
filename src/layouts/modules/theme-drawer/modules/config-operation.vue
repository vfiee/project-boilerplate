<script setup>
import { useThemeStore } from '@/stores'
import { useClipboard } from '@vueuse/core'

defineOptions({
  name: 'ConfigOperation'
})

const themeStore = useThemeStore()
const { copy } = useClipboard()

function getClipboardText() {
  const reg = /"\w+":/g

  const json = themeStore.settingsJson

  return json.replace(reg, (match) => match.replace(/"/g, ''))
}

function handleReset() {
  themeStore.resetStore()

  setTimeout(() => {
    window.$message?.success(`主题重置成功`)
  }, 50)
}

async function handleCopy() {
  await copy(getClipboardText())
  window.$message?.success(`主题已复制到粘贴板`)
}
</script>

<template>
  <div class="flex justify-between">
    <a-button danger @click="handleReset">重置配置</a-button>
    <a-button type="primary" @click="handleCopy">复制配置</a-button>
  </div>
</template>
