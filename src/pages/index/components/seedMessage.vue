<script setup>
import { useAxios } from '@/services'
import { isEmpty, uniqWith, get } from 'lodash-es'
import { ref, computed, onMounted, watch } from 'vue'
import { useCarStore } from '../stores'

defineOptions({ name: 'SendTextMessage' })

const model = ref({})
const carStore = useCarStore()
const visible = defineModel('visible')

// 短信模版列表
const { execute, data } = useAxios('/rest/data/v2.0/query/xoql', {
  method: 'POST',
  module: 'crm',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  params: {
    request: '/rest/data/v2.0/scripts/api/callcenter/beCurrent'
  },
  data: {
    xoql: `select name, template_id__c, dynamicParameter__c, dynamicParameterName__c, correspondingFieldName__c, smsType__c, order__c, valueType__c, format__c from smsTemplate__c where smsType__c = 2 ORDER BY order__c ASC, template_id__c ASC`
  }
})

const messageTemplateOptions = computed(() => {
  if (isEmpty(data.value)) return []
  return uniqWith(
    get(data.value, 'records'),
    (x, y) => x.template_id__c !== y.template_id__c
  ).map(({ name, template_id__c }) => ({ label: name, value: template_id__c }))
})

const messageTemplateFields = computed(() => {
  const records = get(data.value, 'records') || []
  if (!model.value.templateId || isEmpty(records)) return []
  return records.filter(
    (item) => item.template_id__c === model.value.templateId
  )
})

// 品牌列表
const { execute: run, data: data2 } = useAxios('/rest/data/v2.0/query/xoql', {
  method: 'POST',
  module: 'crm',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

// 更新form表单
const updateFormModel = () => {
  const fields = messageTemplateFields.value
  for (let i = 0; i < fields.length; i++) {
    const {
      correspondingFieldName__c,
      dynamicParameter__c,
      order__c,
      format__c,
      valueType__c
    } = fields[i]
    const key = `${dynamicParameter__c}_${order__c}`
    const isDate = valueType__c === '日期'
    const value = get(data2.value, `records[0].${key}`)
    if (correspondingFieldName__c) {
      if (isDate) {
        model.value[key] = value ? dayjs(toNumber(value)).format(format__c) : ''
      } else {
        model.value[key] = value ? value.toString() : ''
      }
    } else {
      model.value[key] = ''
    }
  }
}

watch(
  () => model.value.template,
  async (newTemplateId) => {
    if (isEmpty(messageTemplateFields.value) || !newTemplateId) return
    // await run({
    //   data: {
    //     xoql: `select ${messageTemplateFields.value.join(
    //       ','
    //     )} from SolicitLeads__c where id = ${carStore.taskId}`
    //   }
    // })
    // updateFormModel()
  }
)

onMounted(async () => {
  await execute()
  if (!isEmpty(messageTemplateOptions.value)) {
    model.value.templateId = get(messageTemplateOptions.value, `[0].value`)
  }
})
</script>
<template>
  <a-modal v-model:open="visible" title="发送短信">
    <a-form
      v-model:model="model"
      class="mt-30px"
      labelAlign="left"
      :labelCol="{ span: 4 }"
    >
      <a-form-item label="短信模板">
        <a-select
          v-model:value="model.template"
          :options="messageTemplateOptions"
          placeholder="请选择短信模板"
        />
      </a-form-item>
      <a-form-item label="品牌">
        <a-input v-model:value="model.brand" placeholder="请输入品牌" />
      </a-form-item>
      <a-form-item label="车牌号">
        <a-input v-model:value="model.carNum" placeholder="请输入车牌号" />
      </a-form-item>
      <a-form-item label="手机号">
        <a-input
          v-model:value="model.userTel"
          type="tel"
          placeholder="请输入手机号"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
