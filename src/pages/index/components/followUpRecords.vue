<script setup>
import { useAxios } from '@/services'
import { get } from 'lodash-es'
import { computed } from 'vue'
import { useCarStore } from '../stores'

const carStore = useCarStore()
const { data, execute } = useAxios(
  '/rest/data/v2.0/scripts/api/central/getFirstMaintenanceLeadFollowupRecords',
  { method: 'POST', interceptors: { response: false } }
)

const columns = [
  {
    title: '跟进时间',
    dataIndex: 'followup_time__c',
    key: 'followup_time__c'
  },
  {
    title: '跟进方式',
    dataIndex: 'follow_up_type__c',
    key: 'follow_up_type__c'
  },
  {
    title: '跟进情况',
    dataIndex: 'follow_up_status__c',
    key: 'follow_up_status__c'
  },
  {
    title: '备注',
    dataIndex: 'remarks__c',
    key: 'remarks__c'
  }
]

const dataSources = computed(() => get(data.value, 'records', []) || [])

execute({ data: { dataId: carStore.car.clue_number__c } })
</script>
<template>
  <a-tabs>
    <a-tab-pane>
      <template #tab>
        <span class="text-base text-#666">跟进记录</span>
      </template>
      <a-table
        :columns="columns"
        :data-source="dataSources"
        :pagination="false"
        :scroll="{ y: 170 }"
      />
    </a-tab-pane>
  </a-tabs>
</template>
