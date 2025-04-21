<script setup>
import { useAntdForm, useFormRules } from '@/hooks'
import { ref } from 'vue'
import { useAxios } from '@/services'
import { getUrlParams } from '@/utils'

defineOptions({ name: 'FailReasonModal' })

const model = ref({})
const visible = defineModel('visible')
const { defaultRequiredRule } = useFormRules()
const { formRef, resetFields, validate } = useAntdForm()

const rules = {
  ReasonForFreezing__c: defaultRequiredRule
}

const { execute, isLoading } = useAxios(
  '/rest/data/v2.0/scripts/api/central/createFirstMaintenanceLeadFollowupRecords',
  {
    method: 'POST'
  }
)

const handleSubmit = async () => {
  await validate()
  const { recordId } = getUrlParams()
  await execute({ data: { dataId: recordId, ...model.value, status: 4 } })
  visible.value = false
  resetFields()
  window.$message.success('申请战败成功')
}
</script>
<template>
  <a-modal
    v-model:open="visible"
    title="战败原因"
    @ok="handleSubmit"
    :confirm-loading="isLoading"
  >
    <a-form
      ref="formRef"
      :model="model"
      class="mt-30px"
      labelAlign="left"
      :rules="rules"
      :labelCol="{ span: 4 }"
    >
      <a-form-item name="reason">
        <a-textarea
          v-model:value="model.ReasonForFreezing__c"
          placeholder="可备注具体原因"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
