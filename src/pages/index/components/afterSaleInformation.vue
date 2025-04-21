<script setup>
import { useAxios } from '@/services'
import dayjs from 'dayjs'
import { get, isEmpty, toNumber } from 'lodash-es'
import { computed, ref } from 'vue'
import { useCarStore } from '../stores'

const carStore = useCarStore()
const currentStoreIndex = ref(0)
const { execute, data } = useAxios('/rest/data/v2.0/query/xoql', {
  
  method: 'POST',
  data: {
    xoql: `select id,store__c,createdAt,status__c,order_type__c,store_name__c,factory_code__c,employee_name__c,created__c from dop_order__c where store__c='${carStore.storeId}' AND vin_no__c='${carStore.carNum}'`
  },
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

const insuranceRecord = computed(() => {
  const records = get(data.value, 'records')
  return isEmpty(records) ? [] : records
})

const dataSources = computed(() => {
  const data = get(insuranceRecord.value, `[${currentStoreIndex.value}]`)
  return isEmpty(data) ? [] : [data]
})

const columns = [
  {
    title: '关联工单',
    dataIndex: 'factory_code__c',
    key: 'factory_code__c'
  },
  {
    title: '状态',
    dataIndex: 'status__c',
    key: 'status__c',
    customRender: ({ record }) => get(record, 'status__c[0]', '')
  },
  {
    title: '类型',
    dataIndex: 'order_type__c',
    key: 'order_type__c'
  },
  {
    title: '服务顾问',
    dataIndex: 'employee_name__c',
    key: 'employee_name__c'
  },
  {
    title: '开单时间',
    dataIndex: 'created__c',
    key: 'created__c',
    customRender: ({ record }) => {
      return record?.created__c
        ? dayjs(toNumber(record?.created__c)).format('YYYY-MM-DD')
        : ''
    }
  }
]

execute()
</script>
<template>
  <div class="flex pb-16px info-container max-h-2000px">
    <a-table
      class="flex-1 overflow-hidden"
      :scroll="{ y: '2000px' }"
      :columns="columns"
      :data-source="dataSources"
      :pagination="false"
    />
    <div
      v-if="!isEmpty(insuranceRecord)"
      class="w-300px ml-10px shadow rounded flex-col overflow-hidden bg-white max-h-2000px"
    >
      <div class="text-18px font-bold p-10px pb-0">历史进店</div>
      <div class="flex-1 overflow-auto pb-10px">
        <div
          class="mx-10px mt-10px rounded-8px p-8px border-1px border-solid border-#e8e8e8 cursor-pointer"
          v-for="(
            { id, createdAt, store_name__c, order_type__c }, index
          ) in insuranceRecord"
          :key="id"
          :class="{ 'border-blue': index === currentStoreIndex }"
          @click="currentStoreIndex = index"
        >
          <div class="mt-4px">
            {{ createdAt ? dayjs(+createdAt).format('YYYY-MM-DD') : '' }}
          </div>
          <div class="mt-4px">{{ store_name__c }}</div>
          <div class="bar mt-4px">{{ get(order_type__c, '[0]', '') }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
.bar {
  position: relative;
  padding-left: 10px;
  &::before {
    content: '';
    display: inline-block;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 4px;
    background-color: blue;
  }
}
</style>
