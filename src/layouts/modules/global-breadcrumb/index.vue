<script setup>
import { useRouterStore, useThemeStore } from '@/stores'
import { createReusableTemplate } from '@vueuse/core'
import { useAttrs } from 'vue'
import { useRouter } from 'vue-router'

defineOptions({
  name: 'GlobalBreadcrumb',
  inheritAttrs: false
})

const attrs = useAttrs()
const router = useRouter()
const themeStore = useThemeStore()
const routerStore = useRouterStore()

const [DefineBreadcrumbContent, BreadcrumbContent] = createReusableTemplate()

function handleClickMenu(key) {
  router.push({ name: key })
}
</script>

<template>
  <!-- define component start: BreadcrumbContent -->
  <DefineBreadcrumbContent v-slot="{ breadcrumb }">
    <div class="i-flex-y-center align-middle">
      <component
        :is="breadcrumb.icon"
        v-if="themeStore.header.breadcrumb.showIcon"
        class="mr-4px text-icon"
      />
      {{ breadcrumb.label }}
    </div>
  </DefineBreadcrumbContent>
  <!-- define component end: BreadcrumbContent -->

  <ABreadcrumb v-if="themeStore.header.breadcrumb.visible" v-bind="attrs">
    <ABreadcrumbItem v-for="item in routerStore.breadcrumbs" :key="item.key">
      <BreadcrumbContent :breadcrumb="item" />
      <template v-if="item.children?.length" #overlay>
        <AMenu>
          <AMenuItem
            v-for="option in item.children"
            :key="option.key"
            @click="handleClickMenu(option.routeKey)"
          >
            <BreadcrumbContent :breadcrumb="option" />
          </AMenuItem>
        </AMenu>
      </template>
    </ABreadcrumbItem>
  </ABreadcrumb>
</template>

<style scoped></style>
