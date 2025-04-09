<script setup>
const columns = [
  {
    title: '跟进时间',
    dataIndex: 'followDate',
    key: 'followDate'
  },
  {
    title: '跟进方式',
    dataIndex: 'followType',
    key: 'followType'
  },
  {
    title: '跟进情况',
    dataIndex: 'followInfo',
    key: 'followInfo'
  },
  {
    title: '备注',
    dataIndex: 'remark',
    key: 'remark'
  }
]

const dataSource = [
  {
    key: '1',
    followDate: '2025/02/27 14:44:33',
    followType: '电话跟进',
    followInfo: '继续跟进',
    remark: '备注信息'
  },
  {
    key: '2',
    followDate: '2025/02/27 14:44:33',
    followType: '电话跟进',
    followInfo: '继续跟进',
    remark: '备注信息'
  }
]
</script>
<template>
  <a-tabs>
    <a-tab-pane>
      <template #tab>
        <span class="text-base text-#666">跟进记录</span>
      </template>
      <a-table
        class="h-170px"
        :columns="columns"
        :data-source="dataSource"
        :pagination="false"
      />
    </a-tab-pane>
  </a-tabs>
</template>
