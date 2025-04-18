<script setup>
import { ref, watch } from 'vue'
import { get, merge } from 'lodash-es'
import { useAxios } from '@/services'
import { useAntdForm, useFormRules } from '@/hooks'
import { message } from 'ant-design-vue'
import { sensitivePhone } from '@/utils'

defineOptions({ name: 'EditCarInfo' })

const props = defineProps({
  data: {
    type: Object
  },
  sensitive: {
    type: Boolean,
    default: false
  }
})

const model = ref({})
const visible = defineModel('visible')
const { formRef, validate, clearValidate } = useAntdForm()
const { isLoading, execute } = useAxios(
  `/rest/data/v2.0/xobjects/human_vehicle_relationship__c/${get(
    props,
    'data.data.id'
  )}`,
  { method: 'PATCH', module: 'crm' }
)

const { defaultRequiredRule, patternRules } = useFormRules()

const rules = {
  ownerName: defaultRequiredRule,
  ownerTel: [defaultRequiredRule, patternRules.phone],
  userName: defaultRequiredRule,
  userTel: [defaultRequiredRule, patternRules.phone]
}

function initModel() {
  const { sensitive } = props
  const { custom_union_name__c, custom_union_tel__c, use_name__c, use_tel__c } =
    get(props, 'data.data') || {}
  merge(model.value, {
    ownerName: custom_union_name__c,
    ownerTel: sensitive
      ? sensitivePhone(custom_union_tel__c)
      : custom_union_tel__c,
    userName: use_name__c,
    userTel: sensitive ? sensitivePhone(use_tel__c) : use_tel__c
  })
}

async function handleSubmit() {
  await validate()
  const { ownerName, ownerTel, userName, userTel } = model.value
  execute({
    data: {
      data: {
        custom_union_name__c: ownerName,
        custom_union_tel__c: +ownerTel,
        use_name__c: userName,
        use_tel__c: +userTel
      }
    }
  })
    .then(() => {
      message.success('修改成功')
      visible.value = false
    })
    .catch(console.error)
}

watch([() => props.sensitive, () => props.data.data], initModel, {
  immediate: true
})
</script>
<template>
  <a-modal
    v-model:open="visible"
    title="修改人车关系"
    :confirmLoading="isLoading"
    @ok="handleSubmit"
    :afterClose="clearValidate"
  >
    <a-form ref="formRef" v-model:model="model" class="mt-30px" :rules="rules">
      <a-form-item label="所有人姓名" name="ownerName">
        <a-input v-model:value="model.ownerName" placeholder="请输入姓名" />
      </a-form-item>
      <a-form-item label="所有人电话" name="ownerTel">
        <a-input
          v-model:value="model.ownerTel"
          type="tel"
          placeholder="请输入手机号"
        />
      </a-form-item>
      <a-form-item label="使用者姓名" name="userName">
        <a-input v-model:value="model.userName" placeholder="请输入姓名" />
      </a-form-item>
      <a-form-item label="使用者电话" name="userTel">
        <a-input
          v-model:value="model.userTel"
          type="tel"
          placeholder="请输入手机号"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
