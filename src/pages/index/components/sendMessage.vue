<template>
  <a-modal
    v-model:open="visible"
    title="短信发送"
    ok-text="提交"
    cancel-text="取消"
    :width="420"
    @ok="onOK"
    :after-close="() => emit('update:visible', false)"
    :confirm-loading="loading"
  >
    <section class="py-4">
      <div class="item mb-2">
        <div class="label !w-28">短信模版：</div>
        <div class="content">
          <a-select
            v-model:value="form.templateId"
            class="w-full"
            placeholder="请选择"
            :options="templates"
            @change="onTemplateChange"
          />
        </div>
      </div>
      <div
        class="item mb-2"
        v-for="(field, idx) in templateFields"
        :key="field.key"
      >
        <div class="label !w-28">{{ field.label }}：</div>
        <div class="content">
          <a-input
            v-model:value="form[field.key]"
            :placeholder="`请输入${field.label}`"
          />
        </div>
      </div>
    </section>
  </a-modal>
</template>

<script setup>
import { useTaskStore } from '../stores'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import { computed, ref } from 'vue'
import { useAxios } from '@/services'

const visible = defineModel('visible')

const taskStore = useTaskStore()
const userStore = useUserStore()

const templateMap = ref({})
const templates = computed(() => Object.values(templateMap.value))
const templateFields = computed(() =>
  form.value.templateId ? templateMap.value[form.value.templateId].fields : []
)

const form = ref({
  templateId: ''
})

const loading = ref(false)

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

const loadTemplates = async () => {
  await execute()
  const _templateMap = {}
  data.value.records.forEach((t) => {
    const {
      name,
      template_id__c,
      dynamicParameter__c,
      dynamicParameterName__c,
      correspondingFieldName__c,
      order__c,
      valueType__c,
      format__c
    } = t
    const fields = _templateMap[template_id__c]?.fields || []
    fields.push({
      key: `${dynamicParameter__c}_${order__c}`,
      label: dynamicParameterName__c,
      value: '',
      field: correspondingFieldName__c,
      type: String(valueType__c),
      format: format__c
    })
    _templateMap[template_id__c] = {
      label: name,
      value: template_id__c,
      fields
    }
  })

  templateMap.value = _templateMap
  if (templates.value.length) {
    form.value.templateId = templates.value[0].value
    await loadTemplateValues()
  }
}

const { execute: run, data: data2 } = useAxios('/rest/data/v2.0/query/xoql', {
  method: 'POST',
  module: 'crm',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

const loadTemplateValues = async () => {
  const { fields } = templateMap.value[form.value.templateId]
  const xoql = `select ${fields
    .map((item) => item.field)
    .join(',')} from clue__c where id = ${taskStore.current.clue__c}`
  await run({ data: { xoql } })
  form.value = {
    templateId: form.value.templateId
  }
  const clue = get(data2.value, 'records[0]')
  console.log(`clue:`, clue)

  fields.forEach((field) => {
    if (field.field) {
      if (field.type === '日期') {
        form.value[field.key] = clue[field.field]
          ? dayjs(Number(clue[field.field])).format(field.format)
          : ''
      } else {
        form.value[field.key] = clue[field.field]
          ? String(clue[field.field])
          : ''
      }
    } else {
      form.value[field.key] = ''
    }
  })
}

const onTemplateChange = () => {
  loadTemplateValues()
}

const onOK = async () => {
  const params = {}
  for (let i = 0; i < templateFields.value.length; i++) {
    const field = templateFields.value[i]
    const { key, label } = field
    const [param] = key.split('_')
    const value = form.value[key]
    if (!value) {
      return message.warn(`请输入${label}！`)
    } else {
      params[param] = params[param] || []
      params[param].push(value)
    }
  }
  const dynamicParameter = Object.entries(params)
    .map(([key, values]) => `${key}:${values.join('-')}`)
    .join(',')

  loading.value = true

  const { data } = await lapp.connection.invoke({
    url: `/rest/data/v2.0/scripts/api/sms/sendMessage`,
    method: 'POST',
    data: {
      customPhone: userStore.user.mobile__c,
      templateId: form.value.templateId,
      dynamicParameter
    }
  })

  loading.value = false

  if (data.result?.success) {
    message.success('操作成功！')
  } else {
    message.error(data.result?.message || data.msg)
  }
}

loadTemplates()
</script>
