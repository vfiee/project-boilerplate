<script setup>
import { Icon } from '@iconify/vue'
import { computed } from 'vue'

defineOptions({
  name: 'ButtonIcon',
  inheritAttrs: false
})

const props = defineProps({
  class: {
    type: String,
    default: 'h-36px text-icon'
  },
  icon: {
    type: String,
    default: ''
  },
  tooltipContent: {
    type: String,
    default: ''
  },
  tooltipPlacement: {
    type: String,
    default: 'bottom'
  },
  triggerParent: {
    type: Boolean,
    default: false
  }
})

function getPopupContainer(triggerNode) {
  return props.triggerParent ? triggerNode.parentElement : document.body
}

const DEFAULT_CLASS = 'h-[36px] text-icon'

const cls = computed(() => `${DEFAULT_CLASS} ${props.class}`)
</script>

<template>
  <ATooltip
    :title="tooltipContent"
    :placement="tooltipPlacement"
    :get-popup-container="getPopupContainer"
  >
    <AButton
      type="text"
      class="h-[36px] text-icon"
      :class="cls"
      v-bind="$attrs"
    >
      <div class="flex-center gap-8px">
        <slot>
          <Icon :icon="icon" />
        </slot>
      </div>
    </AButton>
  </ATooltip>
</template>
