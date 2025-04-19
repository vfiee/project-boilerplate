<script setup>
import { useAxios } from '@/services'
import { getUrlParams, updateDialogTitle } from '@/utils'
import { get, merge } from 'lodash-es'
import AfterSalesContent from './components/afterSalesContent.vue'
import AfterSalesTask from './components/afterSalesTask.vue'
import CarInfo from './components/carInfo.vue'
import { useCarStore } from './stores'

updateDialogTitle('人工坐席招揽任务详情')
const carStore = useCarStore()

// 获取当前行数据
const { execute, data, isLoading } = useAxios('/rest/data/v2.0/query/xoql', {
  module: 'crm',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

// 根据当前行数据ID获取车架号和店铺ID
const { execute: executeCarRecordDetail, data: carDetailData } = useAxios(
  '/rest/data/v2.0/scripts/api/crmapi/getFmaer/get',
  {
    module: 'crm',
    method: 'get',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }
)

// 获取人车关系数据
const { execute: getCarRelation, data: carRelationData } = useAxios(
  '/rest/data/v2.0/query/xoql',
  {
    module: 'crm',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }
)

async function getCarRecordDetail() {
  const { recordId } = getUrlParams()
  await executeCarRecordDetail({ params: { id: recordId } })
  const queryFields = [
    'id',
    'store__c',
    'vin_no__c',
    'license_plate__c',
    'car_series__c',
    'brand__c'
  ]
  await execute({
    data: {
      xoql: `select ${queryFields.join(
        ','
      )}  from first_maintenance_artificial_examine_records__c where id='${recordId}'`
    }
  })
  const carData = get(data.value, 'records[0]')
  await getCarRelation({
    data: {
      xoql: `select id,license_plate_number__c,car_series_code__c,custom_union_name__c,brand_name__c,series_name__c,vehicle_name__c,vin__c,engine__c,custom_union_tel__c,custom_union_id__c,major_sender__c,vehicle_name__c,use_tel__c,car_bind_tel__c,car_bind_name__c,date_the_vehicle_was_registered_with_the_DMV__c__c from human_vehicle_relationship__c where vin__c='${carDetailData.value.vin}'`
    }
  })
  carStore.setCar(
    merge(
      {},
      carDetailData.value,
      carData,
      get(carRelationData.value, 'records[0]')
    )
  )
}

getCarRecordDetail()
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
