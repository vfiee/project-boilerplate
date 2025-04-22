<script setup>
import { useAxios } from '@/services'
import dayjs from 'dayjs'
import { get, isEmpty, toNumber } from 'lodash-es'
import { computed, ref, watch } from 'vue'
import { useCarStore } from '../stores'

const carStore = useCarStore()
const currentStoreIndex = ref(0)
// 获取历史进店
const { execute: getStoreList, data: storeData } = useAxios(
  '/rest/data/v2.0/scripts/api/central/dopOrderGroup',
  {
    method: 'POST',
    interceptors: {
      response: false
    }
  }
)

const storeList = computed(() => {
  const list = get(storeData.value, 'record') || []
  return isEmpty(list) ? [] : list
})

// 获取进店数据
const {
  execute: getDetail,
  data,
  isLoading
} = useAxios('/rest/data/v2.0/scripts/api/central/dopOrder', {
  method: 'POST',
  interceptors: {
    response: false
  }
})

const records = computed(() => {
  const records = get(data.value, 'records')
  return isEmpty(records) ? [] : records
})

const columns = [
  {
    title: '关联工单',
    dataIndex: 'id',
    key: 'id'
  },
  {
    title: '状态',
    dataIndex: 'status__c',
    key: 'status__c'
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

async function init() {
  await getStoreList({ data: { vin_no__c: carStore.carNum } })
  if (isEmpty(storeList.value)) return
  const { created, storeId } =
    get(storeList.value, `[${currentStoreIndex.value}]`) || {}
  await getDetail({
    data: { created, storeId, vin_no__c: carStore.carNum }
  })
}

watch(currentStoreIndex, (index) => {
  const { created, storeId } = get(storeList.value, `[${index}]`) || {}
  getDetail({
    data: { created, storeId, vin_no__c: carStore.carNum }
  })
})

init()
</script>
<template>
  <div class="flex pb-16px info-container max-h-2000px">
    <a-table
      class="flex-1 overflow-hidden"
      :scroll="{ y: '2000px' }"
      :columns="columns"
      :data-source="records"
      :pagination="false"
      :loading="isLoading"
    />
    <div
      v-if="!isEmpty(storeList)"
      class="w-300px ml-10px shadow rounded flex-col overflow-hidden bg-white max-h-2000px"
    >
      <div class="text-18px font-bold p-10px pb-0">历史进店</div>
      <div class="flex-1 overflow-auto pb-10px">
        <div
          class="mx-10px mt-10px rounded-8px p-8px border-1px border-solid border-#e8e8e8 cursor-pointer"
          v-for="(
            { id, created, orderType, storeName, storeName2 }, index
          ) in storeList"
          :key="id"
          :class="{ 'border-blue': index === currentStoreIndex }"
          @click="currentStoreIndex = index"
        >
          <div class="mt-4px">{{ created }}</div>
          <div class="mt-4px">{{ storeName || storeName2 }}</div>
          <div class="bar mt-4px">{{ orderType }}</div>
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
