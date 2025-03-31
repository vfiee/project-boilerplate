<script setup>
import ButtonIcon from '../buttonIcon/index.vue';

defineOptions({
  name: 'FullScreen'
})

defineProps({
  full: {
    type: Boolean
  }
})
</script>

<template>
  <ButtonIcon
    :key="String(full)"
    :tooltip-content="full ? '退出全屏' : '全屏'"
    class="text-20px"
    :icon="
      full ? 'icon-park:off-screen-one' : 'icon-park-outline:full-screen-one'
    "
  >
  </ButtonIcon>
</template>

<style scoped></style>
