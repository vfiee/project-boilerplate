<script setup>
import { useAppStore, useThemeStore } from '@/stores'
import { computed } from 'vue'
import { AdminLayout, __SCROLL_EL_ID } from '../modules/admin'
import GlobalContent from '../modules/global-content/index.vue'
import GlobalFooter from '../modules/global-footer/index.vue'
import GlobalHeader from '../modules/global-header/index.vue'
import GlobalMenu from '../modules/global-menu/index.vue'
import GlobalSider from '../modules/global-sider/index.vue'
import GlobalTab from '../modules/global-tab/index.vue'
import ThemeDrawer from '../modules/theme-drawer/index.vue'

defineOptions({
  name: 'BaseLayout'
})

const appStore = useAppStore()
const themeStore = useThemeStore()

const siderWidth = computed(() => themeStore.sider.siderWidth)
const siderVisible = computed(() => themeStore.layout.mode !== 'horizontal')
const siderCollapsedWidth = computed(() => themeStore.sider.collapsedWidth)

const headerProps = computed(() => {
  const { mode } = themeStore.layout

  const headerPropsConfig = {
    vertical: {
      showLogo: false,
      showMenu: false,
      showMenuToggler: true
    },
    'vertical-mix': {
      showLogo: false,
      showMenu: false,
      showMenuToggler: false
    },
    horizontal: {
      showLogo: true,
      showMenu: true,
      showMenuToggler: false
    },
    'horizontal-mix': {
      showLogo: true,
      showMenu: true,
      showMenuToggler: false
      // reverseHorizontalMix && isActiveFirstLevelMenuHasChildren.value
    }
  }

  return headerPropsConfig[mode]
})
</script>

<template>
  <AdminLayout
    v-model:sider-collapse="appStore.siderCollapse"
    :mode="layoutMode"
    :scroll-el-id="__SCROLL_EL_ID"
    :scroll-mode="themeStore.layout.scrollMode"
    :is-mobile="themeStore.isMobile"
    :full-content="appStore.fullContent"
    :fixed-top="themeStore.fixedHeaderAndTab"
    :header-height="themeStore.header.height"
    :tab-visible="themeStore.tab.visible"
    :tab-height="themeStore.tab.height"
    :content-class="appStore.contentXScrollable ? 'overflow-x-hidden' : ''"
    :sider-visible="siderVisible"
    :sider-width="siderWidth"
    :sider-collapsed-width="siderCollapsedWidth"
    :footer-visible="themeStore.footer.visible"
    :footer-height="themeStore.footer.height"
    :fixed-footer="themeStore.footer.fixed"
    :right-footer="themeStore.footer.right"
  >
    <template #header> <GlobalHeader v-bind="headerProps" /> </template>
    <template #tab><GlobalTab /></template>
    <template #sider> <GlobalSider /> </template>
    <GlobalMenu />
    <GlobalContent />
    <ThemeDrawer />
    <template #footer>
      <GlobalFooter />
    </template>
  </AdminLayout>
</template>
