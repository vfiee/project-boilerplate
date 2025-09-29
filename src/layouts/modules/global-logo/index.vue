<script setup>
import { SYSTEM_NAME } from '@/config'
import { Icon } from '@iconify/vue'

defineOptions({
  name: 'GlobalLogo'
})

defineProps({
  showTitle: {
    type: Boolean,
    default: true
  }
})
</script>

<template>
  <RouterLink to="/" class="w-full flex-center nowrap-hidden">
    <Icon
      icon="line-md:sun-rising-loop"
      class="text-32px text-primary text-[var(--primary-color)]"
    />
    <h2
      v-show="showTitle"
      class="pl-8px text-16px text-primary font-bold transition duration-300 ease-in-out"
    >
      {{ SYSTEM_NAME }}
    </h2>
  </RouterLink>
</template>
