<script setup>
import { ref } from 'vue'
import AfterSaleInformation from './afterSaleInformation.vue'
import AfterSaleSolicitation from './afterSaleSolicitation.vue'
import InsuranceInformation from './insuranceInformation.vue'
import UserAdvantage from './userAdvantage.vue'

const activeKey = ref('2')
</script>

<template>
  <a-tabs
    class="bg-white mt-16px px-16px rounded transition-all tab-container"
    v-model:activeKey="activeKey"
  >
    <a-tab-pane key="1" tab="售后信息">
      <AfterSaleInformation />
    </a-tab-pane>
    <a-tab-pane key="2" tab="售后招揽">
      <AfterSaleSolicitation />
    </a-tab-pane>
    <a-tab-pane key="3" tab="保单信息">
      <InsuranceInformation />
    </a-tab-pane>
    <a-tab-pane key="4" tab="客户权益">
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
