<script setup>
// 定保跟进
import { useBoolean } from '@/hooks'
import { useAxios } from '@/services'
import { getUrlParams } from '@/utils'
import { ref } from 'vue'
import ApplyFreeze from './applyFreeze.vue'
import FailReason from './failReason.vue'

defineOptions({ name: 'FollowUp' })

const form = ref()
const model = ref({})
const { bool: failVisible, setTrue: setFailTrue } = useBoolean()
const { bool: freezeVisible, setTrue: setFreezeTrue } = useBoolean()

const rules = {
  lastUpTime: {
    required: true,
    message: '请选择下次跟进日期'
  }
}

const { execute } = useAxios(
  '/rest/data/v2.0/scripts/api/central/createFirstMaintenanceLeadFollowupRecords',
  {
    method: 'POST'
  }
)

// 保存跟进
async function handleSubmit() {
  await form.value.validate()
  const { recordId } = getUrlParams()
  const { lastUpTime, ...rest } = model.value
  await execute({
    data: {
      ...rest,
      lastUpTime: lastUpTime.valueOf(),
      status: 3,
      dataId: recordId
    }
  })
  model.value = {}
  window.$message.success('跟进成功')
}
</script>
<template>
  <a-form
    ref="form"
    :model="model"
    class="flex-1 b-l-1 b-solid b-#999 px-30px"
    :rules="rules"
    :labelCol="{ span: 3 }"
  >
    <a-row :gutter="0">
      <a-col :span="12">
        <a-form-item :labelCol="{ span: 6 }" name="lastUpTime" label="下次跟进">
          <a-date-picker
            show-time
            v-model:value="model.lastUpTime"
            placeholder="请选择日期"
          />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item name="isNotConnected__c">
          <a-checkbox v-model:checked="model.isNotConnected__c"
            >未接通</a-checkbox
          >
        </a-form-item>
      </a-col>
    </a-row>
    <a-form-item name="remarks" label="备注">
      <a-textarea v-model:value="model.remarks" placeholder="请输入备注信息" />
    </a-form-item>
    <a-form-item :wrapper-col="{ offset: 3 }">
      <a-button type="link" class="text-#333" @click="setFreezeTrue"
        >申请冻结</a-button
      >
      <a-button danger class="mr-10px" @click="setFailTrue">战败</a-button>
      <a-button type="primary" @click="handleSubmit">保存跟进</a-button>
    </a-form-item>
  </a-form>
  <FailReason v-model:visible="failVisible" />
  <ApplyFreeze v-model:visible="freezeVisible" />
</template>
