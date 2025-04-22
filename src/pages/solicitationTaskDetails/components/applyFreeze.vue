<script setup>
import { ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { getUrlParams } from '@/utils'
import { useAxios } from '@/services'

defineOptions({ name: 'ApplyFreeze' })

const visible = defineModel('visible')

const model = ref({
  ReasonForFreezing__c: true
})

watch(
  () => model.value.ReasonForFreezing__c,
  (val) => {
    if (val) {
      model.value.remarks = ''
    }
  }
)

const { execute, isLoading } = useAxios(
  '/rest/data/v2.0/scripts/api/central/createFirstMaintenanceLeadFollowupRecords',
  {
    method: 'POST'
  }
)
const handleSubmit = async () => {
  const { recordId } = getUrlParams()
  await execute({ data: { dataId: recordId, status: 6, ...model.value } })
  visible.value = false
  window.$message.success('申请冻结成功')
}
</script>
<template>
  <a-modal
    v-model:open="visible"
    title="申请冻结"
    @ok="handleSubmit"
    :confirm-loading="isLoading"
  >
    <a-form v-model:model="model" labelAlign="left" :labelCol="{ span: 4 }">
      <div class="my-20px bg-pink-100 p-10px text-red flex-y-center rounded">
        <span class="whitespace-nowrap">
          请选择冻结理由，申请通过后，该客户将不会出现在之后的招揽任务中
        </span>
        <Icon
          class="text-20px text-#333"
          icon="material-symbols-light:close-rounded"
        />
      </div>
      <a-form-item name="other">
        <a-radio-group
          class="w-full"
          v-model:value="model.ReasonForFreezing__c"
        >
          <a-row>
            <a-col>
              <a-radio :value="true"> 客户拒绝打扰 </a-radio>
            </a-col>
          </a-row>
          <a-row class="mt-30px">
            <a-col span="4">
              <a-radio :value="false"> 其它 </a-radio>
            </a-col>
            <a-col span="20">
              <a-textarea
                v-model:value="model.remarks"
                :disabled="model.ReasonForFreezing__c"
                placeholder="可备注具体原因"
              />
            </a-col>
          </a-row>
        </a-radio-group>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
