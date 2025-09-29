import { GLOBAL_TABS } from '@/config'
import router from '@/router'
import { getStorage, setStorage } from '@/utils'
import { useEventListener } from '@vueuse/core'
import { filter, last, map } from 'lodash-es'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useThemeStore } from '../theme'
import {
  extractTabsByAllRoutes,
  filterTabsById,
  findTabByRouteName,
  getAllTabs,
  getDefaultHomeTab,
  getFixedTabIds,
  getTabByRoute,
  isTabInTabs
} from './shared'

export const useTabStore = defineStore('tab', () => {
  const themeStore = useThemeStore()

  const tabs = ref([])
  const homeTab = ref()
  const activeTabId = ref()
  const allTabs = computed(() => getAllTabs(tabs.value, homeTab.value))

  function initTabStore(currentRoute) {
    const storageTabs = getStorage(GLOBAL_TABS)

    if (themeStore.tab.cache && storageTabs) {
      tabs.value = extractTabsByAllRoutes(router, storageTabs)
    }

    addTab(currentRoute)
  }

  function initHomeTab() {
    if (homeTab.value) return
    homeTab.value = getDefaultHomeTab()
  }

  function addTab(route, active = true) {
    const tab = getTabByRoute(route)

    const isHomeTab = tab.id === homeTab.value?.id

    if (!isHomeTab && !isTabInTabs(tab.id, tabs.value)) {
      tabs.value.push(tab)
    }

    if (active) {
      setActiveTabId(tab.id)
    }
  }

  async function removeTab(tabId) {
    const isRemoveActiveTab = activeTabId.value === tabId
    const updatedTabs = filterTabsById(tabId, tabs.value)

    function update() {
      tabs.value = updatedTabs
    }

    if (!isRemoveActiveTab) {
      update()
      return
    }
    const activeTab = updatedTabs.at(-1) || homeTab.value

    if (activeTab) {
      await switchRouteByTab(activeTab)
      update()
    }
  }

  async function removeActiveTab() {
    await removeTab(activeTabId.value)
  }

  async function removeTabByRouteName(routeName) {
    const tab = findTabByRouteName(routeName, tabs.value)
    if (!tab) return
    await removeTab(tab.value)
  }

  async function switchRouteByTab(tab) {
    const fail = await router.push(tab.fullPath)
    if (!fail) {
      setActiveTabId(tab.id)
    }
  }

  async function clearTabs(excludes = []) {
    const remainTabIds = [...getFixedTabIds(tabs.value), ...excludes]
    const removeTabIds = map(tabs.value, 'id').filter(
      (id) => !remainTabIds.includes(id)
    )
    const isRemoveActiveTab = removeTabIds.includes(activeTabId.value)
    const updatedTabs = filter(
      tabs.value,
      (tab) => !removeTabIds.includes(tab.id)
    )

    const update = () => {
      tabs.value = updatedTabs
    }

    if (!isRemoveActiveTab) {
      update()
      return
    }
    const activeTab = last(updatedTabs) || homeTab.value
    await switchRouteByTab(activeTab)
    update()
  }

  async function clearLeftTabs(tabId) {
    const tabIds = tabs.value.map((tab) => tab.id)
    const index = tabIds.indexOf(tabId)
    if (index === -1) return

    const excludes = tabIds.slice(index)
    await clearTabs(excludes)
  }

  async function clearRightTabs(tabId) {
    const isHomeTab = tabId === homeTab.value?.id
    if (isHomeTab) {
      clearTabs()
      return
    }

    const tabIds = tabs.value.map((tab) => tab.id)
    const index = tabIds.indexOf(tabId)
    if (index === -1) return

    const excludes = tabIds.slice(0, index + 1)
    await clearTabs(excludes)
  }

  function setActiveTabId(id) {
    activeTabId.value = id
  }

  function isTabRetain(tabId) {
    if (tabId === homeTab.value?.id) return true

    const fixedTabIds = getFixedTabIds(tabs.value)

    return fixedTabIds.includes(tabId)
  }

  function cacheTabs() {
    if (!themeStore.tab.cache) return

    setStorage(GLOBAL_TABS, tabs.value)
  }

  useEventListener(window, 'beforeunload', () => {
    cacheTabs()
  })

  return {
    tabs: allTabs,
    homeTab,
    activeTabId,
    initTabStore,
    initHomeTab,
    addTab,
    removeTab,
    removeActiveTab,
    removeTabByRouteName,
    switchRouteByTab,
    clearTabs,
    clearLeftTabs,
    clearRightTabs,
    isTabRetain,
    setActiveTabId
  }
})
