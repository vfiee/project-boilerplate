<script setup>
import { ref } from 'vue'
import ButtonIcon from '@/components/buttonIcon/index.vue'
import AfterSaleInformation from './afterSaleInformation.vue'
import AfterSaleSolicitation from './afterSaleSolicitation.vue'
import InsuranceInformation from './insuranceInformation.vue'
import UserAdvantage from './userAdvantage.vue'

const hide = defineModel('hide')

const activeKey = ref('3')
</script>

<template>
  <a-tabs
    class="bg-white mt-16px px-16px rounded flex-1 transition-all overflow-hidden tab-container"
    :class="{ 'h-50px flex-none': hide }"
    v-model:activeKey="activeKey"
  >
    <template #rightExtra>
      <ButtonIcon
        class="text-20px ml-16px"
        :icon="!hide ? 'octicon:fold-24' : 'octicon:unfold-24'"
        @click="() => (hide = !hide)"
        :tooltipContent="!hide ? '收起' : '展开'"
      />
    </template>
    <a-tab-pane class="h-full" key="1" tab="售后信息">
      <AfterSaleInformation />
    </a-tab-pane>
    <a-tab-pane class="h-full" key="2" tab="售后招揽">
      <AfterSaleSolicitation />
    </a-tab-pane>
    <a-tab-pane class="h-full" key="3" tab="保单信息">
      <InsuranceInformation />
    </a-tab-pane>
    <a-tab-pane class="h-full" key="4" tab="客户权益">
      <UserAdvantage />
    </a-tab-pane>
  </a-tabs>
</template>
<style lang="less" scoped>
.tab-container {
  :deep(.ant-tabs-content-holder) {
    height: 100%;
    .ant-tabs-content {
      height: 100%;
    }
  }
}
</style>
