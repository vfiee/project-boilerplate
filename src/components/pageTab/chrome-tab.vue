<script setup>
import ChromeTabBg from './chrome-tab-bg.vue';
import { props as tabProps } from './shared';

defineOptions({
  name: 'ChromeTab'
})

defineProps(tabProps)

defineSlots()
</script>

<template>
  <div
    class="chrome-tab relative inline-flex cursor-pointer items-center justify-center gap-16px whitespace-nowrap px-24px py-6px -mr-18px"
    :class="{
      'chrome-tab_dark': darkMode,
      'chrome-tab_active': active,
      'chrome-tab_active_dark': active && darkMode
    }"
  >
    <div
      class="pointer-events-none absolute left-0 top-0 h-full w-full -z-1 chrome-tab__bg"
    >
      <ChromeTabBg />
    </div>
    <slot name="prefix"></slot>
    <slot></slot>
    <slot name="suffix"></slot>
    <div
      class="absolute right-7px h-16px w-1px bg-#1f2225 chrome-tab-divider"
    ></div>
  </div>
</template>
