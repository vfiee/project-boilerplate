<script setup>
import { useAntdForm, useFormRules } from '@/hooks'
import { useAuthStore } from '@/stores'
import { computed, reactive } from 'vue'
import { useLoginModule } from '../share'

defineOptions({
  name: 'PwdLogin'
})

const authStore = useAuthStore()
const { formRef, validate } = useAntdForm()
const { updateLoginModule } = useLoginModule()

const model = reactive({
  userName: 'qingxin',
  password: '123456'
})

const rules = computed(() => {
  const { formRules } = useFormRules()

  return {
    userName: formRules.userName,
    password: formRules.pwd
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
    <AFormItem name="userName">
      <AInput
        v-model:value="model.userName"
        size="large"
        placeholder="请输入用户名"
      />
    </AFormItem>
    <AFormItem name="password">
      <AInputPassword
        v-model:value="model.password"
        size="large"
        placeholder="请输入密码"
      />
    </AFormItem>
    <ASpace direction="vertical" size="large" class="w-full">
      <div class="flex-y-center justify-between">
        <ACheckbox>记住密码</ACheckbox>
        <AButton type="text" @click="updateLoginModule('reset-pwd')">
          重置密码
        </AButton>
      </div>
      <AButton
        type="primary"
        block
        size="large"
        shape="round"
        :loading="authStore.loginLoading"
        @click="handleSubmit"
      >
        确认
      </AButton>
      <div class="flex-y-center justify-between">
        <AButton
          class="h-34px flex-1"
          block
          @click="updateLoginModule('code-login')"
        >
          验证码登录
        </AButton>
        <div class="w-12px"></div>
        <AButton
          class="h-34px flex-1"
          block
          @click="updateLoginModule('register')"
        >
          注册
        </AButton>
      </div>
    </ASpace>
  </AForm>
</template>
