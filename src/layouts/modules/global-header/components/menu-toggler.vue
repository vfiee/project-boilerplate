<script setup>
import ButtonIcon from '@/components/buttonIcon/index.vue'
import { Icon } from '@iconify/vue'
import { get } from 'lodash-es'
import { computed } from 'vue'

defineOptions({ name: 'MenuToggler' })

const props = defineProps({
  collapsed: {
    type: Boolean
  },
  arrowIcon: {
    type: Boolean
  }
})

const icon = computed(() => {
  const arrowIcon = Number(props.arrowIcon || false)

  const collapsed = Number(props.collapsed || false)
  return get(
    {
      0: {
        0: 'line-md:menu-fold-left',
        1: 'line-md:menu-fold-right'
      },
      1: {
        0: 'ph-caret-double-left-bold',
        1: 'ph-caret-double-right-bold'
      }
    },
    `[${arrowIcon}][${collapsed}]`
  )
})
</script>

<template>
  <ButtonIcon
    :key="String(collapsed)"
    :tooltip-content="collapsed ? '展开菜单' : '折叠菜单'"
    tooltip-placement="bottomLeft"
  >
    <Icon class="text-22px" :icon="icon" />
  </ButtonIcon>
</template>

<style scoped></style>
