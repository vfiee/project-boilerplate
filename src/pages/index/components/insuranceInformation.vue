<script setup>
import { createReusableTemplate } from '@vueuse/core'
import { isEmpty } from 'lodash-es'

const [DefineTemplate, ReuseTemplate] = createReusableTemplate()

const dataOne = {
  list: [
    { label: '车牌号', value: '123456789012345678' },
    { label: '所有人', value: '张三' },
    { label: '签单日期', value: '张三' },
    { label: '投保类型', value: '李四' },
    { label: '签单人', value: '1000000' },
    { label: '保险专员', value: '1000000' }
  ],
  list2: [
    { label: '投保人', value: '123456789012345678' },
    { label: '被保人', value: '张三' },
    { label: '证件类型', value: '张三' },
    { label: '证件类型', value: '李四' },
    { label: '联系方式', value: '1000000' },
    { label: '联系方式', value: '1000000' },
    { label: '证件号码', value: '1000000' },
    { label: '证件号码', value: '1000000' }
  ]
}

const dataTwo = {
  list: [
    { label: '起保时间', value: '2023-10-01' },
    { label: '终保时间', value: '2023-10-01' },
    { label: '生效时间', value: '2023-10-01' }
  ]
}

const dataThree = {
  list: [
    { label: '起保时间', value: '2023-10-01' },
    { label: '终保时间', value: '2023-10-01' },
    { label: '生效时间', value: '2023-10-01' }
  ]
}

const insuranceRecord = Array.from(Array(14)).map((_, index) => ({
  key: index,
  date: '2023-10-01',
  store: '永达****店铺',
  type: '售后服务'
}))

const onStoreChange = () => {
  console.log('onStoreChange')
}
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
        <div class="flex-1 ml-20px">{{ value }}</div>
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
          <div class="flex-1 ml-20px">{{ value }}</div>
        </div>
      </div>
    </template>
  </DefineTemplate>
  <div class="flex h-full pb-16px info-container">
    <div class="flex-1">
      <ReuseTemplate
        :data="dataOne"
        :title="{
          left: { text: '中国平安财产保险股份有限公司', class: 'font-bold' },
          right: { text: '总保费：3625.06', class: 'text-blue' }
        }"
      />
      <ReuseTemplate
        containerClass="mt-16px"
        :data="dataTwo"
        :title="{
          left: { text: '交强险（保单号：10i53）', class: 'font-bold' },
          right: { text: '¥625.06', class: 'font-bold' }
        }"
      />
      <ReuseTemplate
        containerClass="mt-16px"
        :data="dataThree"
        :title="{
          left: { text: '商业险（保单号：102i48)', class: 'font-bold' },
          right: { text: '¥2925.06', class: 'font-bold' }
        }"
      />
    </div>
    <div
      class="w-300px ml-10px shadow h-full rounded flex-col overflow-hidden bg-white"
    >
      <div class="text-18px font-bold p-10px pb-0">历史保单</div>
      <div class="flex-1 overflow-auto pb-10px">
        <div
          class="mx-10px mt-10px rounded-8px p-8px border-1px border-solid border-#e8e8e8 cursor-pointer"
          v-for="{ key, date, store, type } in insuranceRecord"
          :key="key"
          @click="onStoreChange"
        >
          <div class="mt-4px">{{ date }}</div>
          <div class="mt-4px">{{ store }}</div>
          <div class="bar mt-4px">
            <div>{{ type }}</div>
            <div>{{ type }}</div>
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
