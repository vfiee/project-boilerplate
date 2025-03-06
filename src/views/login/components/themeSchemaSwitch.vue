<script setup>
import ButtonIcon from '@/components/buttonIcon/index.vue'
import { get } from 'lodash-es'
import { computed } from 'vue'

defineOptions({ name: 'ThemeSchemaSwitch' })

const props = defineProps({
  showTooltip: {
    type: Boolean,
    default: true
  },
  themeSchema: {
    type: String,
    default: 'light'
  },
  tooltipPlacement: {
    type: String,
    default: 'bottom'
  }
})

const emit = defineEmits(['switch'])

function handleSwitch() {
  emit('switch')
}

const icons = {
  light: 'material-symbols:sunny',
  dark: 'material-symbols:nightlight-rounded',
  auto: 'material-symbols:hdr-auto'
}

const icon = computed(() => icons[props.themeSchema])

const tooltipContent = computed(() => {
  if (!props.showTooltip) return ''
  return get(
    {
      light: '浅色',
      dark: '深色',
      auto: '自动'
    },
    props.themeSchema
  )
})
</script>

<template>
  <ButtonIcon
    :icon="icon"
    :tooltip-content="tooltipContent"
    :tooltip-placement="tooltipPlacement"
    @click="handleSwitch"
  />
</template>
