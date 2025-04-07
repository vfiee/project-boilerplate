<script setup lang="jsx">
import ButtonIcon from '@/components/buttonIcon/index.vue'

const columns1 = [
  {
    title: '目标条件',
    dataIndex: 'key',
    key: 'key'
  },
  {
    title: '招揽人员',
    dataIndex: 'followDate',
    key: 'followDate'
  }
]
const columns = [
  {
    title: '跟进时间',
    dataIndex: 'key',
    key: 'key'
  },
  {
    title: '跟进方式',
    dataIndex: 'followDate',
    key: 'followDate'
  },
  {
    title: '跟进情况',
    dataIndex: 'followType',
    key: 'followType'
  },
  {
    title: '备注',
    dataIndex: 'remark',
    key: 'remark',
    width: 150,
    customRender: ({ record }) => {
      return (
        <ButtonIcon
          class="text-18px"
          icon="mi:message"
          tooltipPlacement="top"
          tooltipContent={record.remark}
        />
      )
    }
  }
]

const dataSource = Array.from(Array(40)).map((_, index) => ({
  key: index,
  followDate: '2023-10-01',
  followType: '已完成',
  followInfo: '售后服务',
  remark: '张三'
}))

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
  <div class="flex h-full pb-16px info-container">
    <div class="flex-1">
      <a-table
        :scroll="{ y: 'calc(100vh - 80vh)' }"
        :columns="columns1"
        :data-source="dataSource"
        :pagination="false"
      />
      <a-table
        :scroll="{ y: 'calc(100vh - 50vh)' }"
        :columns="columns"
        :data-source="dataSource"
        :pagination="false"
      />
    </div>
    <div
      class="w-300px ml-10px shadow h-full rounded flex-col overflow-hidden bg-white"
    >
      <div class="text-18px font-bold p-10px pb-0">历史活动</div>
      <div class="flex-1 overflow-auto pb-10px">
        <div
          class="mx-10px mt-10px rounded-8px p-8px border-1px border-solid border-#e8e8e8 cursor-pointer"
          v-for="{ key, date, store, type } in insuranceRecord"
          :key="key"
          @click="onStoreChange"
        >
          <div class="mt-4px">{{ date }}</div>
          <div class="mt-4px">{{ store }}</div>
          <div class="bar mt-4px font-bold">{{ type }}</div>
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
