<script setup>
import { Icon } from '@iconify/vue'
import { computed } from 'vue'
import ButtonTab from './button-tab.vue'
import ChromeTab from './chrome-tab.vue'
import { createTabCssVars, props as tabProps } from './shared'

defineOptions({
  name: 'PageTab'
})

const props = defineProps(tabProps)

const emits = defineEmits(['close'])

const activeTabComponent = computed(() => {
  const { mode, chromeClass, buttonClass } = props

  const tabComponentMap = {
    chrome: {
      component: ChromeTab,
      class: chromeClass
    },
    button: {
      component: ButtonTab,
      class: buttonClass
    }
  }

  return tabComponentMap[mode]
})

const cssVars = computed(() => createTabCssVars(props.activeColor))

const bindProps = computed(() => {
  const { chromeClass: _chromeCls, buttonClass: _btnCls, ...rest } = props

  return rest
})
</script>

<template>
  <component
    :is="activeTabComponent.component"
    :class="activeTabComponent.class"
    :style="cssVars"
    v-bind="bindProps"
  >
    <template #prefix>
      <slot name="prefix"></slot>
    </template>
    <slot></slot>
    <template #suffix>
      <slot name="suffix">
        <Icon
          class="svg-close relative h-16px w-16px inline-flex items-center justify-center rd-50% text-14px"
          icon="material-symbols-light:close-rounded"
          @click.stop="emits('close')"
        />
      </slot>
    </template>
  </component>
</template>

<style lang="less">
.button-tab {
  border-color: #e5e7eb;
}

.button-tab_dark {
  border-color: #ffffff3d;
}

.button-tab:hover {
  color: var(--tabs-primary-color);
  border-color: var(--tabs-primary-color-opacity3);
}

.button-tab_active {
  color: var(--tabs-primary-color);
  border-color: var(--tabs-primary-color-opacity3);
  background-color: var(--tabs-primary-color-opacity1);
}

.button-tab_active_dark {
  background-color: var(--tabs-primary-color-opacity2);
}

.button-tab .svg-close:hover {
  font-size: 12px;
  color: #ffffff;
  background-color: var(--tabs-primary-color);
}

.button-tab_dark .svg-close:hover {
  color: #000000;
}

.chrome-tab:hover {
  z-index: 9;
}

.chrome-tab_active {
  z-index: 10;
  color: var(--tabs-primary-color);
}

.chrome-tab__bg {
  color: transparent;
}

.chrome-tab_active .chrome-tab__bg {
  color: var(--tabs-primary-color1);
}

.chrome-tab_active_dark .chrome-tab__bg {
  color: var(--tabs-primary-color2);
}

.chrome-tab:hover .chrome-tab__bg {
  color: #dee1e6;
}

.chrome-tab_active:hover .chrome-tab__bg {
  color: var(--tabs-primary-color1);
}

.chrome-tab_dark:hover .chrome-tab__bg {
  color: #333333;
}

.chrome-tab_active_dark:hover .chrome-tab__bg {
  color: var(--tabs-primary-color2);
}

.chrome-tab .svg-close:hover {
  font-size: 12px;
  color: #ffffff;
  background-color: #9ca3af;
}

.chrome-tab_active .svg-close:hover {
  background-color: var(--tabs-primary-color);
}

.chrome-tab_dark .svg-close:hover {
  color: #000000;
}

.chrome-tab_active .chrome-tab-divider {
  opacity: 0;
}

.chrome-tab:hover .chrome-tab-divider {
  opacity: 0;
}

.chrome-tab_dark .chrome-tab-divider {
  background-color: rgba(255, 255, 255, 0.9);
}
</style>
