<script setup>
import { useAxios } from '@/services'
import { createReusableTemplate } from '@vueuse/core'
import { get, isEmpty, isFunction } from 'lodash-es'
import { computed, ref } from 'vue'
import { useCarStore } from '../stores'

const [DefineTemplate, ReuseTemplate] = createReusableTemplate()

const carStore = useCarStore()
const { data, execute } = useAxios(
  '/rest/data/v2.0/scripts/api/central/crmGetInsuranceList',
  {
    method: 'POST'
  }
)

const current = ref(0)
const list = computed(() => (isEmpty(data.value) ? [] : data.value))
const detail = computed(() => get(list.value, `[${current.value}]`) || {})

const dataOne = {
  list: [
    { label: '车牌号', value: 'licenseNo' },
    { label: '所有人', value: 'allName' },
    { label: '签单日期', value: 'issueTime' },
    {
      label: '投保类型',
      value: (data) =>
        get(
          {
            237001: '新保',
            237002: '续保',
            237002: '转保'
          },
          get(data, 'issueType')
        ) || ''
    },
    { label: '签单人', value: 'createUserName' },
    { label: '保险专员', value: 'belongerDopName' }
  ],
  list2: [
    { label: '投保人', value: 'insureName' },
    { label: '被保人', value: 'insuredName' },
    { label: '证件类型', value: 'insureCertificateType' },
    { label: '证件类型', value: 'insuredCertificateType' },
    { label: '联系方式', value: 'insureMobileNo' },
    { label: '联系方式', value: 'insuredMobileNo' },
    { label: '证件号码', value: 'insureCertificateNo' },
    { label: '证件号码', value: 'insuredCertificateType' }
  ]
}

const dataTwo = {
  list: [
    { label: '起保时间', value: 'compulsoryInsuranceStartDate' },
    { label: '终保时间', value: 'compulsoryInsuranceEndDate' },
    { label: '生效时间', value: 'compulsoryInsuranceEnforceTime' }
  ]
}

const dataThree = {
  list: [
    { label: '起保时间', value: 'commercialInsuranceStartDate' },
    { label: '终保时间', value: 'commercialInsuranceEndDate' },
    { label: '生效时间', value: 'commercialInsuranceEnforceTime' }
  ]
}

execute({ data: { vin: carStore.carNum } })
</script>
<template>
  <DefineTemplate v-slot="{ data, title, containerClass }">
    <div
      class="h-50px flex-y-center px-16px bg-#F5F9FC rounded"
      :class="containerClass"
    >
      <div class="text-17px" :class="title.left.class">
        {{ title.left.text }}
      </div>
      <div class="ml-auto" :class="title.right.class">
        {{ title.right.text }}
      </div>
    </div>
    <div v-if="!isEmpty(data.list)" class="grid grid-cols-2">
      <div
        class="flex-y-center text-#999 px-16px mt-10px"
        v-for="({ label, value }, index) in data.list"
        :key="index"
      >
        <div class="w-80px">{{ label }}</div>
        <div class="flex-1 ml-20px">
          {{ isFunction(value) ? value(detail) : get(detail, value, '') }}
        </div>
      </div>
    </div>
    <template v-if="!isEmpty(data.list2)">
      <a-divider />
      <div class="grid grid-cols-2">
        <div
          class="flex-y-center text-#999 px-16px mt-10px"
          v-for="({ label, value }, index) in data.list2"
          :key="index"
        >
          <div class="w-80px">{{ label }}</div>
          <div class="flex-1 ml-20px">
            {{ isFunction(value) ? value(detail) : get(detail, value, '') }}
          </div>
        </div>
      </div>
    </template>
  </DefineTemplate>
  <div class="flex pb-16px info-container">
    <div class="flex-1">
      <ReuseTemplate
        :data="dataOne"
        :title="{
          left: { text: detail.insuranceCompany, class: 'font-bold' },
          right: {
            text: `总保费：${detail.totalPremium || ''}`,
            class: 'text-blue'
          }
        }"
      />
      <ReuseTemplate
        containerClass="mt-16px"
        :data="dataTwo"
        :title="{
          left: {
            text: `交强险（保单号：${
              detail.compulsoryInsurancePolicyNo || ''
            }）`,
            class: 'font-bold'
          },
          right: {
            text: `¥${detail.commercialInsuranceActualPremium || 0}`,
            class: 'font-bold'
          }
        }"
      />
      <ReuseTemplate
        containerClass="mt-16px"
        :data="dataThree"
        :title="{
          left: {
            text: `商业险（保单号：${
              detail.commercialInsurancePolicyNo || ''
            })`,
            class: 'font-bold'
          },
          right: {
            text: `¥${detail.compulsoryInsuranceActualPremium || 0}`,
            class: 'font-bold'
          }
        }"
      />
    </div>
    <div
      class="w-300px ml-10px shadow rounded flex-col overflow-hidden bg-white max-h-700px"
    >
      <div class="text-18px font-bold p-10px pb-0">历史保单</div>
      <div class="flex-1 overflow-auto pb-10px">
        <div
          class="mx-10px mt-10px rounded-8px p-8px border-1px border-solid border-#e8e8e8 cursor-pointer"
          v-for="(
            {
              key,
              issueTime,
              storeName,
              commercialInsuranceActualPremium,
              compulsoryInsuranceActualPremium
            },
            index
          ) in list"
          :key="key"
          :class="{ 'border-blue': index === current }"
          @click="current = index"
        >
          <div class="mt-4px">{{ issueTime }}</div>
          <div class="mt-4px">{{ storeName }}</div>
          <div class="bar mt-4px">
            <div>交强险：{{ compulsoryInsuranceActualPremium }}</div>
            <div>商业险：{{ commercialInsuranceActualPremium }}</div>
          </div>
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
