<script setup>
import { useBoolean } from '@/hooks'
import { useAxios } from '@/services'
import { sensitivePhone } from '@/utils'
import { Icon } from '@iconify/vue'
import { get, isEmpty } from 'lodash-es'
import { computed } from 'vue'
import { useCallStore } from '../stores'
import EditCarInfo from './editCarInfo.vue'

// 车架号
const carNumber = 'LHGCP168792006753'

const callStore = useCallStore()
const { bool: sensitive, toggleBoolean } = useBoolean(true)
const { bool, setTrue } = useBoolean(false)
const icon = computed(() =>
  !sensitive.value ? 'ph:eye-light' : 'solar:eye-closed-bold'
)

// 获取车辆信息
const { execute, data } = useAxios('/rest/data/v2.0/query/xoql', {
  module: 'crm',
  method: 'POST',
  data: {
    xoql: `select id,license_plate_number__c,custom_union_name__c__c,brand_name__c,series_name__c,vehicle_name__c,vin__c,engine__c,date_the_vehicle_was_registered_with_the_DMV__c__c,custom_union_tel__c__c,custom_union_id__c,major_sender__c,Vehicle_name__c__c,Vehicle_tel__c__c,car_bind_id__c__c,car_bind_tel__c__c,car_bind_name__c__c from human_vehicle_relationship__c where vin__c='${carNumber}'`
  },
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

// 车辆信息
const carList = [
  {
    label: '- 所有人',
    value: 'records[0].custom_union_name__c__c'
  },
  {
    label: '- 品牌',
    value: 'records[0].brand_name__c'
  },
  {
    label: '- 车系',
    value: 'records[0].series_name__c'
  },
  {
    label: '- 车型',
    class: 'text-ellipsis',
    value: 'records[0].vehicle_name__c'
  },
  {
    label: '- 车架号',
    value: 'records[0].vin__c'
  },
  {
    label: '- 发动机号',
    value: 'records[0].engine__c'
  },
  {
    label: '- 注册日期',
    value: 'records[0].date_the_vehicle_was_registered_with_the_DMV__c__c'
  }
]
// 保险信息
const insuranceList = [
  { label: '- 交强止期', value: '' },
  { label: '- 商业止期', value: '' },
  { label: '- 质保止期', value: '' }
]
// 人车关系
const carRelationshipList = computed(() => {
  return [
    {
      name: 'records[0].custom_union_name__c__c',
      tel: 'records[0].custom_union_tel__c__c',
      text: '所',
      cls: 'bg-blue'
    },
    {
      name: 'records[0].Vehicle_name__c__c',
      tel: 'records[0].Vehicle_tel__c__c',
      text: '用',
      cls: 'bg-green'
    },
    {
      name: 'records[0].car_bind_name__c__c',
      tel: 'records[0].car_bind_tel__c__c',
      text: '绑',
      cls: 'bg-yellow'
    }
  ].map(({ name, tel, ...args }) => {
    const telephone = get(data.value, tel)
    const sensitiveTel = telephone ? sensitivePhone(telephone) : ''
    return {
      ...args,
      telephone,
      sensitiveTel,
      hasPhone: !!telephone,
      name: get(data.value, name)
    }
  })
})

const makePhoneCall = ({ telephone }) => {
  $('#dialout_input').val(telephone)
  callStore.dial()
}

execute()
</script>

<template>
  <div class="w-300px bg-white h-full pt-16px rounded-md">
    <!-- 车辆基本信息 -->
    <div class="font-500 text-22px bar mb-20px">
      {{ get(data, 'records[0].license_plate_number__c') }}
    </div>
    <div
      v-for="({ label, value, class: cls }, index) in carList"
      :key="index"
      :class="cls"
      class="pl-10px mt-4px"
    >
      {{ label }}：{{ get(data, value) || '-' }}
    </div>
    <a-divider class="px-10 w-280px min-w-280px mx-10px my-20px" />
    <!-- 保险信息 -->
    <div
      v-for="({ label, value, class: cls }, index) in insuranceList"
      :key="index"
      :class="cls"
      class="pl-10px mt-4px"
    >
      {{ label }}：{{ get(data, value) || '-' }}
    </div>
    <a-divider class="px-10 w-280px min-w-280px mx-10px my-20px" />
    <!-- 人车关系 -->
    <div class="px-10px flex-y-center">
      <span class="text-18px font-500">人车关系</span>
      <Icon
        class="ml-6px text-20px cursor-pointer"
        :icon="icon"
        @click="() => toggleBoolean()"
      />
      <Icon
        v-if="!isEmpty(data)"
        icon="material-symbols-light:contract-edit-outline-sharp"
        class="ml-auto text-20px cursor-pointer"
        @click="setTrue"
      />
    </div>
    <div
      class="flex-y-center px-10px mt-16px"
      v-for="(item, index) in carRelationshipList"
      :key="'relation-' + index"
    >
      <div
        class="size-20px rounded-full text-center line-height-20px text-white text-12px"
        :class="item.cls"
      >
        {{ item.text }}
      </div>
      <div class="text-16px text-#333 ml-6px flex-1">
        {{ item.name || '-' }}
      </div>
      <div class="text-16px text-#333 ml-14px flex-1">
        {{ sensitive ? item.sensitiveTel : item.telephone || '' }}
      </div>
      <Icon
        v-if="item.hasPhone"
        class="text-16px ml-12px cursor-pointer"
        icon="iconoir:phone-solid"
        @click="makePhoneCall(item)"
      />
    </div>
    <EditCarInfo
      v-if="!isEmpty(data)"
      v-model:visible="bool"
      :sensitive="sensitive"
      :data="{
        carRelationshipList,
        data: get(data, 'records[0]')
      }"
    />
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
    background-color: #4e80f5;
  }
}
</style>
