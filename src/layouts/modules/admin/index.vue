<script setup>
import { computed } from 'vue'
import { adminLayoutProps, createLayoutCssVars } from './props'

defineOptions({
  name: 'AdminLayout'
})

const slots = defineSlots()
const props = defineProps(adminLayoutProps)
const emits = defineEmits(['update:siderCollapse'])

const cssVars = computed(() => createLayoutCssVars(props))

// config visible
const showHeader = computed(() => Boolean(slots.header) && props.headerVisible)
const showTab = computed(() => Boolean(slots.tab) && props.tabVisible)
const showSider = computed(
  () => !props.isMobile && Boolean(slots.sider) && props.siderVisible
)
const showMobileSider = computed(
  () => props.isMobile && Boolean(slots.sider) && props.siderVisible
)
const showFooter = computed(() => Boolean(slots.footer) && props.footerVisible)

// scroll mode
const isWrapperScroll = computed(() => props.scrollMode === 'wrapper')
const isContentScroll = computed(() => props.scrollMode === 'content')

// layout direction
const isVertical = computed(() => props.mode === 'vertical')
const isHorizontal = computed(() => props.mode === 'horizontal')

const fixedHeaderAndTab = computed(
  () => props.fixedTop || (isHorizontal.value && isWrapperScroll.value)
)

// css
const leftGapClass = computed(() => {
  if (!props.fullContent && showSider.value) {
    return props.siderCollapse ? 'left-gap_collapsed' : 'left-gap'
  }
  return ''
})

const headerLeftGapClass = computed(() =>
  isVertical.value ? leftGapClass.value : ''
)

const footerLeftGapClass = computed(() => {
  const condition1 = isVertical.value
  const condition2 =
    isHorizontal.value && isWrapperScroll.value && !props.fixedFooter
  const condition3 = Boolean(isHorizontal.value && props.rightFooter)

  return condition1 || condition2 || condition3 ? leftGapClass.value : ''
})

const siderPaddingClass = computed(() => {
  const cls = []

  if (showHeader.value && !headerLeftGapClass.value) {
    cls.push('sider-padding-top')
  }
  if (showFooter.value && !footerLeftGapClass.value) {
    cls.push('sider-padding-bottom')
  }

  return cls.join(' ')
})

function handleClickMask() {
  emit('update:siderCollapse', true)
}
</script>
<template>
  <div class="relative h-full" :class="[commonClass]" :style="cssVars">
    <div
      :id="isWrapperScroll ? scrollElId : undefined"
      class="h-full flex-col"
      :class="[
        commonClass,
        scrollWrapperClass,
        { 'overflow-y-auto': isWrapperScroll }
      ]"
    >
      <!-- Header -->
      <template v-if="showHeader">
        <header
          v-show="!fullContent"
          class="flex-shrink-0 layout-header"
          :class="[
            commonClass,
            headerClass,
            headerLeftGapClass,
            { 'absolute top-0 left-0 w-full': fixedHeaderAndTab }
          ]"
        >
          <slot name="header"></slot>
        </header>
        <div
          v-show="!fullContent && fixedHeaderAndTab"
          class="flex-shrink-0 overflow-hidden layout-header-placement"
        ></div>
      </template>

      <!-- Tab -->
      <template v-if="showTab">
        <div
          class="flex-shrink-0 layout-tab"
          :class="[
            commonClass,
            tabClass,
            { 'top-0!': fullContent || !showHeader },
            leftGapClass,
            { 'absolute left-0 w-full': fixedHeaderAndTab }
          ]"
        >
          <slot name="tab"></slot>
        </div>
        <div
          v-show="fullContent || fixedHeaderAndTab"
          class="flex-shrink-0 overflow-hidden layout-tab-placement"
        ></div>
      </template>

      <!-- Sider -->
      <template v-if="showSider">
        <aside
          v-show="!fullContent"
          class="absolute left-0 top-0 h-full"
          :class="[
            commonClass,
            siderClass,
            siderPaddingClass,
            siderCollapse ? 'layout-sider_collapsed' : 'layout-sider'
          ]"
        >
          <slot name="sider"></slot>
        </aside>
      </template>

      <!-- Mobile Sider -->
      <template v-if="showMobileSider">
        <aside
          class="absolute left-0 top-0 h-full w-0 bg-white layout-mobile-sider"
          :class="[
            commonClass,
            mobileSiderClass,
            siderCollapse ? 'overflow-hidden' : 'layout-sider'
          ]"
        >
          <slot name="sider"></slot>
        </aside>
        <div
          v-show="!siderCollapse"
          class="absolute left-0 top-0 h-full w-full bg-[rgba(0,0,0,0.2)] layout-mobile-sider-mask"
          @click="handleClickMask"
        ></div>
      </template>

      <!-- Main Content -->
      <main
        :id="isContentScroll ? scrollElId : undefined"
        class="flex-col flex-grow"
        :class="[
          commonClass,
          contentClass,
          leftGapClass,
          { 'overflow-y-auto': isContentScroll }
        ]"
      >
        <slot></slot>
      </main>

      <!-- Footer -->
      <template v-if="showFooter">
        <footer
          v-show="!fullContent"
          class="flex-shrink-0 layout-footer"
          :class="[
            commonClass,
            footerClass,
            footerLeftGapClass,
            { 'absolute left-0 bottom-0 w-full': fixedFooter }
          ]"
        >
          <slot name="footer"></slot>
        </footer>
        <div
          v-show="!fullContent && fixedFooter"
          class="flex-shrink-0 overflow-hidden layout-footer-placement"
        ></div>
      </template>
    </div>
  </div>
</template>
<style lang="less" scoped>
/* @type */

.layout-header,
.layout-header-placement {
  height: var(--admin-header-height);
}

.layout-header {
  z-index: var(--admin-header-z-index);
}

.layout-tab {
  top: var(--admin-header-height);
  height: var(--admin-tab-height);
  z-index: var(--admin-tab-z-index);
}

.layout-tab-placement {
  height: var(--admin-tab-height);
}

.layout-sider {
  width: var(--admin-sider-width);
  z-index: var(--admin-sider-z-index);
}

.layout-mobile-sider {
  z-index: var(--admin-sider-z-index);
}

.layout-mobile-sider-mask {
  z-index: var(--admin-mobile-sider-z-index);
}

.layout-sider_collapsed {
  width: var(--admin-sider-collapsed-width);
  z-index: var(--admin-sider-z-index);
}

.layout-footer,
.layout-footer-placement {
  height: var(--admin-footer-height);
}

.layout-footer {
  z-index: var(--admin-footer-z-index);
}

.left-gap {
  padding-left: var(--admin-sider-width);
}

.left-gap_collapsed {
  padding-left: var(--admin-sider-collapsed-width);
}

.sider-padding-top {
  padding-top: var(--admin-header-height);
}

.sider-padding-bottom {
  padding-bottom: var(--admin-footer-height);
}
</style>
