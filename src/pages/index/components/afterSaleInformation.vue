<script setup>
const columns = [
  {
    title: '关联工单',
    dataIndex: 'followDate',
    key: 'followDate'
  },
  {
    title: '状态',
    dataIndex: 'followType',
    key: 'followType'
  },
  {
    title: '类型',
    dataIndex: 'followInfo',
    key: 'followInfo'
  },
  {
    title: '服务顾问',
    dataIndex: 'remark',
    key: 'remark'
  },
  {
    title: '开单时间',
    dataIndex: 'remark',
    key: 'remark'
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
    <a-table
      class="flex-1 h-full overflow-hidden"
      :scroll="{ y: 'calc(100vh - 230px)' }"
      :columns="columns"
      :data-source="dataSource"
      :pagination="false"
    />
    <div
      class="w-300px ml-10px shadow h-full rounded flex-col overflow-hidden bg-white"
    >
      <div class="text-18px font-bold p-10px pb-0">历史进店</div>
      <div class="flex-1 overflow-auto pb-10px">
        <div
          class="mx-10px mt-10px rounded-8px p-8px border-1px border-solid border-#e8e8e8 cursor-pointer"
          v-for="{ key, date, store, type } in insuranceRecord"
          :key="key"
          @click="onStoreChange"
        >
          <div class="mt-4px">{{ date }}</div>
          <div class="mt-4px">{{ store }}</div>
          <div class="bar mt-4px">{{ type }}</div>
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
