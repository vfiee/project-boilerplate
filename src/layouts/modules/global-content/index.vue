<script setup>
import { useAppStore, useRouterStore, useThemeStore } from '@/stores'
import { computed } from 'vue'
import { __SCROLL_EL_ID } from '../admin'

defineOptions({
  name: 'GlobalContent'
})

defineProps({
  showPadding: {
    type: Boolean,
    default: true
  }
})

const appStore = useAppStore()
const themeStore = useThemeStore()
const routerStore = useRouterStore()

const transitionName = computed(() =>
  themeStore.page.animate ? themeStore.page.animateMode : ''
)

function resetScroll() {
  const el = document.querySelector(`#${__SCROLL_EL_ID}`)

  el?.scrollTo({ left: 0, top: 0 })
}
</script>

<template>
  <RouterView v-slot="{ Component, route }">
    <Transition
      mode="out-in"
      :name="transitionName"
      @after-leave="resetScroll"
      @before-leave="appStore.setContentXScrollable(true)"
      @after-enter="appStore.setContentXScrollable(false)"
    >
      <KeepAlive
        :include="routerStore.cachedRoutes"
        :exclude="routerStore.uncachedRoutes"
      >
        <component
          v-if="appStore.reloadFlag"
          :is="Component"
          :key="route.path"
          :class="{ 'p-16px': showPadding }"
          class="flex-grow bg-layout transition-300"
        />
      </KeepAlive>
    </Transition>
  </RouterView>
</template>

<style></style>
