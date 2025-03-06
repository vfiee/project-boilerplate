<script setup>
import { GLOBAL_SIDER_MENU_ID } from '@/config'
import { useAppStore, useRouterStore, useThemeStore } from '@/stores'
import { computed, Teleport } from 'vue'
import { useRouter } from 'vue-router'
import { useMenu } from '../share'

defineOptions({
  name: 'VerticalMenu'
})

const appStore = useAppStore()
const themeStore = useThemeStore()
const routerStore = useRouterStore()
const router = useRouter()

const { selectedKey } = useMenu()

const darkTheme = computed(
  () => !themeStore.darkMode && themeStore.sider.inverted
)

const menuTheme = computed(() => (darkTheme.value ? 'dark' : 'light'))

const openKeys = computed(() => {
  if (appStore.siderCollapse || !selectedKey.value) return []

  if (!selectedKey.value) return []

  return routerStore.getSelectedMenuKeyPath(selectedKey.value)
})

function handleClickMenu(menuInfo) {
  router.push(menuInfo.item.originItemValue.routePath)
}
</script>

<template>
  <Teleport defer :to="`#${GLOBAL_SIDER_MENU_ID}`">
    <div
      class="h-full flex-1-hidden menu-wrapper"
      :class="{ 'select-menu': !darkTheme }"
    >
      <a-menu
        mode="inline"
        :theme="menuTheme"
        :items="routerStore.menus"
        :selected-keys="[selectedKey]"
        :open-keys="openKeys"
        :inline-collapsed="appStore.siderCollapse"
        :inline-indent="18"
        class="size-full transition-300 border-0!"
        :class="{ 'bg-container!': !darkTheme }"
        @click="handleClickMenu"
      />
    </div>
  </Teleport>
</template>
