<script setup>
import ButtonIcon from '@/components/buttonIcon/index.vue'
import { Icon } from '@iconify/vue'

defineOptions({
  name: 'ReloadButton'
})

defineProps({
  loading: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <ButtonIcon tooltip-content="刷新">
    <Icon
      icon="famicons:reload-sharp"
      class="text-20px"
      :class="{ 'animate-spin animate-duration-750': loading }"
    />
  </ButtonIcon>
</template>
