<script setup>
import { ref } from 'vue'

defineOptions({ name: 'SendTextMessage' })

const visible = defineModel('visible')

const model = ref({})
</script>
<template>
  <a-modal v-model:open="visible" title="发送短信">
    <a-form v-model:model="model" class="mt-30px" labelAlign="left" :labelCol="{ span: 4 }">
      <a-form-item label="短信模板">
        <a-select v-model:value="model.template" placeholder="请选择短信模板" />
      </a-form-item>
      <a-form-item label="品牌">
        <a-input v-model:value="model.brand" placeholder="请输入品牌" />
      </a-form-item>
      <a-form-item label="车牌号">
        <a-input v-model:value="model.carNum" placeholder="请输入车牌号" />
      </a-form-item>
      <a-form-item label="车险顾问">
        <a-input v-model:value="model.userName" placeholder="请输入车险顾问" />
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
