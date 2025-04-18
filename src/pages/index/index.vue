<script setup>
import { useAxios } from '@/services'
import { getUrlParams, updateDialogTitle } from '@/utils'
import { get } from 'lodash-es'
import AfterSalesContent from './components/afterSalesContent.vue'
import AfterSalesTask from './components/afterSalesTask.vue'
import CarInfo from './components/carInfo.vue'
import { useCarStore } from './stores'

updateDialogTitle('人工坐席招揽任务详情')
const carStore = useCarStore()

const { execute, data, isLoading } = useAxios('/rest/data/v2.0/query/xoql', {
  module: 'crm',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

async function getCarDetail() {
  const { recordId } = getUrlParams()
  await execute({
    data: {
      xoql: `select id,store__c,vin_no__c from first_maintenance_artificial_examine_records__c where id='${recordId}'`
    }
  })
  carStore.setCar(get(data.value, 'records[0]'))
}

getCarDetail()
</script>
<template>
  <div class="size-full bg-[#e6e9f0] p-10px flex">
    <a-spin class="size-full flex-center" v-if="isLoading"> </a-spin>
    <template v-else-if="carStore.carNum">
      <CarInfo />
      <div class="flex-1 ml-10px h-full overflow-y-auto">
        <AfterSalesTask />
        <AfterSalesContent />
      </div>
    </template>
  </div>
</template>
<style lang="less" scoped>
.car-wrapper {
  :global(.ant-spin-container) {
    @apply size-full;
  }
}
</style>
