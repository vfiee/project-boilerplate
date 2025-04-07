<script setup>
import { Icon } from '@iconify/vue'
import { createReusableTemplate } from '@vueuse/core'
import { ref } from 'vue'

const [DefineTemplate, CardTemplate] = createReusableTemplate()
const storeId = ref()

const options = [
  { label: '店铺1', value: '1' },
  { label: '店铺2', value: '2' },
  { label: '店铺3', value: '3' }
]

const columnsOne = [
  {
    key: '1',
    dataIndex: '1',
    title: '卡卷名称/类型'
  },
  {
    key: '2',
    dataIndex: '2',
    title: '价值/项目'
  },
  {
    key: '3',
    dataIndex: '3',
    title: '客户姓名/手机号'
  },
  {
    key: '4',
    dataIndex: '4',
    title: '发放形式/期限'
  },
  {
    key: '5',
    dataIndex: '5',
    title: '适用企业'
  }
]

const columnsTwo = [
  {
    key: '1-1',
    dataIndex: '1-1',
    title: '积分数量'
  },
  {
    key: '1-2',
    dataIndex: '1-2',
    title: '有效期限'
  },
  {
    key: '1-3',
    dataIndex: '1-3',
    title: '客户姓名'
  },
  {
    key: '1-4',
    dataIndex: '1-4',
    title: '手机号码/信用代码'
  },
  {
    key: '1-5',
    dataIndex: '1-5',
    title: '适用企业'
  }
]

const columnsThree = [
  {
    key: '3-1',
    dataIndex: '3-1',
    title: '储值数量'
  },
  {
    key: '3-2',
    dataIndex: '3-2',
    title: '客户姓名'
  },
  {
    key: '3-4',
    dataIndex: '3-4',
    title: '手机号码/信用代码'
  },
  {
    key: '3-5',
    dataIndex: '3-5',
    title: '适用企业'
  }
]

const handleChange = (value) => {
  console.log(`选中的店铺ID: `, value)
}

const filterOption = (input, option) => {
  const { value } = option
  return value.indexOf(input) >= 0
}
</script>
<template>
  <DefineTemplate
    v-slot="{
      icon,
      iconClass,
      title,
      count,
      description,
      handleClick,
      containerClass
    }"
  >
    <div
      class="border border-#e8e8e8 border-solid rounded p-16px bg-white shadow ml-16px min-w-200px"
      :class="containerClass"
      @click="handleClick"
    >
      <div class="flex-y-center">
        <Icon :icon="icon" class="text-30px" :class="iconClass" />
        <span class="ml-4px">{{ title }}</span>
        <span class="ml-auto text-20px font-bold">{{ count }}</span>
      </div>
      <div class="mt-8px">{{ description }}</div>
    </div>
  </DefineTemplate>
  <div>
    <div class="flex-y-center">
      <a-select
        v-model:value="storeId"
        show-search
        allow-clear
        placeholder="请选择店铺"
        class="w-200px"
        :options="options"
        :filter-option="filterOption"
        @change="handleChange"
      />
      <CardTemplate
        icon="lsicon:coupon-outline"
        iconClass="text-yellow-500"
        title="卡卷"
        count="2"
        description="暂无即将到期的卡劵"
        containerClass="min-w-180px"
      />
      <CardTemplate
        icon="mynaui:bitcoin-square"
        iconClass="text-green-500"
        title="积分"
        count="0"
        description="暂无即将到期的积分"
        containerClass="min-w-180px"
      />
      <CardTemplate
        icon="bx:wallet"
        iconClass="text-blue-500"
        title="储值"
        count="0"
        description="储值无有效限期"
        containerClass="min-w-180px"
      />
    </div>
    <a-table :columns="columnsOne" class="mt-16px" />
    <a-table :columns="columnsTwo" class="mt-16px" />
    <a-table :columns="columnsThree" class="mt-16px" />
  </div>
</template>
