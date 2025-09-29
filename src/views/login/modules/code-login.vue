<script setup>
import { useAntdForm, useCaptcha, useFormRules } from '@/hooks'
import { computed, reactive } from 'vue'
import { useLoginModule } from '../share'

defineOptions({
  name: 'CodeLogin'
})

const { updateLoginModule } = useLoginModule()
const { formRef, validate } = useAntdForm()
const { label, isCounting, loading, getCaptcha } = useCaptcha()

const model = reactive({
  phone: '',
  code: ''
})

const rules = computed(() => {
  const { formRules } = useFormRules()

  return {
    phone: formRules.phone,
    code: formRules.code
  }
})

async function handleSubmit() {
  await validate()
}
</script>

<template>
  <AForm
    ref="formRef"
    :model="model"
    :rules="rules"
    @keyup.enter="handleSubmit"
  >
    <AFormItem name="phone">
      <AInput
        v-model:value="model.phone"
        size="large"
        placeholder="请输入手机号"
      />
    </AFormItem>
    <AFormItem name="code">
      <div class="w-full flex-y-center gap-16px">
        <AInput
          v-model:value="model.code"
          size="large"
          placeholder="请输入验证码"
        />
        <AButton
          size="large"
          :disabled="isCounting"
          :loading="loading"
          @click="getCaptcha(model.phone)"
        >
          {{ label }}
        </AButton>
      </div>
    </AFormItem>
    <ASpace direction="vertical" size="large" class="w-full">
      <AButton
        type="primary"
        block
        size="large"
        shape="round"
        @click="handleSubmit"
      >
        确认
      </AButton>
      <AButton
        block
        size="large"
        shape="round"
        @click="updateLoginModule('pwd-login')"
      >
        返回
      </AButton>
    </ASpace>
  </AForm>
</template>

<style scoped></style>
