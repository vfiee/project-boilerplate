<script setup>
import { props as tabProps } from './shared';

defineOptions({
  name: 'ButtonTab'
})

defineProps(tabProps)

defineSlots()
</script>

<template>
  <div
    class="relative inline-flex cursor-pointer items-center justify-center gap-12px whitespace-nowrap border-(1px solid) rounded-4px px-12px py-4px button-tab"
    :class="{
      'button-tab_dark': darkMode,
      'button-tab_active': active,
      'button-tab_active_dark': active && darkMode
    }"
  >
    <slot name="prefix"></slot>
    <slot></slot>
    <slot name="suffix"></slot>
  </div>
</template>

<style scoped></style>
