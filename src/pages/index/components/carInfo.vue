<script setup>
import { useBoolean } from '@/hooks'
import { useAxios } from '@/services'
import { sensitivePhone } from '@/utils'
import { Icon } from '@iconify/vue'
import dayjs from 'dayjs'
import { get, isEmpty, isFunction } from 'lodash-es'
import { computed } from 'vue'
import { useCallStore, useCarStore } from '../stores'
import EditCarInfo from './editCarInfo.vue'

const callStore = useCallStore()
const carStore = useCarStore()
const { bool: sensitive, toggleBoolean } = useBoolean(true)
const { bool, setTrue } = useBoolean(false)
const icon = computed(() =>
  !sensitive.value ? 'ph:eye-light' : 'solar:eye-closed-bold'
)

// 获取车辆保险信息
const { execute: execute, data: data2 } = useAxios(
  '/rest/data/v2.0/scripts/api/central/crmGetInsuranceList',
  {
    method: 'POST'
  }
)

// 车辆信息
const carList = [
  {
    label: '- 所有人',
    value: 'custom_union_name__c'
  },
  {
    label: '- 品牌',
    value: 'brand_name__c'
  },
  {
    label: '- 车系',
    value: 'series_name__c'
  },
  {
    label: '- 车型',
    class: 'text-ellipsis',
    value: 'vehicle_name__c'
  },
  {
    label: '- 车架号',
    value: 'vin__c'
  },
  {
    label: '- 发动机号',
    value: 'engine__c'
  },
  {
    label: '- 注册日期',
    value: (data) => {
      const item = get(
        data,
        'date_the_vehicle_was_registered_with_the_DMV__c__c'
      )
      return item ? dayjs(item).format('YYYY-MM-DD') : ''
    }
  }
]
// 保险信息
const insuranceList = [
  { label: '- 交强止期', value: '[0].compulsoryInsuranceEndDate' },
  { label: '- 商业止期', value: '[0].commercialInsuranceEndDate' }
]
// 人车关系
const carRelationshipList = computed(() => {
  return [
    {
      name: 'custom_union_name__c',
      tel: 'custom_union_tel__c',
      text: '所',
      cls: 'bg-blue'
    },
    {
      name: 'use_name__c',
      tel: 'use_tel__c',
      text: '用',
      cls: 'bg-green'
    },
    {
      name: 'car_bind_name__c',
      tel: 'car_bind_tel__c',
      text: '绑',
      cls: 'bg-yellow'
    }
  ].map(({ name, tel, ...args }) => {
    const telephone = get(carStore.car, tel)
    const sensitiveTel = telephone ? sensitivePhone(telephone) : ''
    return {
      ...args,
      telephone,
      sensitiveTel,
      hasPhone: !!telephone,
      name: get(carStore.car, name)
    }
  })
})

const makePhoneCall = ({ telephone }) => {
  $('#dialout_input').val(telephone)
  callStore.dial()
}
execute({ data: { vin: carStore.carNum } })
</script>

<template>
  <div class="w-300px bg-white h-full pt-16px rounded-md">
    <!-- 车辆基本信息 -->
    <div class="font-500 text-22px bar mb-20px">
      {{ get(carStore.car, 'license_plate__c') }}
    </div>
    <div
      v-for="({ label, value, class: cls }, index) in carList"
      :key="index"
      :class="cls"
      class="pl-10px mt-4px"
    >
      {{ label }}：{{
        isFunction(value)
          ? value(carStore.car)
          : get(carStore.car, value) || '-'
      }}
    </div>
    <a-divider class="px-10 w-280px min-w-280px mx-10px my-20px" />
    <!-- 保险信息 -->
    <div
      v-for="({ label, value, class: cls }, index) in insuranceList"
      :key="index"
      :class="cls"
      class="pl-10px mt-4px"
    >
      {{ label }}：{{ get(data2, value) || '-' }}
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
        data: carStore.car
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
