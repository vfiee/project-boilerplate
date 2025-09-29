<script setup>
import { GLOBAL_HEADER_MENU_ID } from '@/config'
import { useRouterStore, useThemeStore } from '@/stores'
import { useRouter } from 'vue-router'
import { useMenu } from '../share'

defineOptions({
  name: 'HorizontalMenu'
})

const router = useRouter()
const themeStore = useThemeStore()
const routeStore = useRouterStore()
const { selectedKey } = useMenu()

function handleClickMenu(menuInfo) {
  router.push(menuInfo.item.originItemValue.routePath)
}
</script>

<template>
  <Teleport :to="`#${GLOBAL_HEADER_MENU_ID}`">
    <AMenu
      mode="horizontal"
      :selected-keys="[selectedKey]"
      :items="routeStore.menus"
      class="horizontal-menu size-full transition-300 border-0!"
      :class="{ 'bg-container!': themeStore.darkMode }"
      :style="{ lineHeight: themeStore.header.height + 'px' }"
      @click="handleClickMenu"
    />
  </Teleport>
</template>

<style lang="scss" scoped></style>
