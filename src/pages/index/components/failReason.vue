<script setup>
import { ref } from 'vue'

defineOptions({ name: 'FailReasonModal' })

const visible = defineModel('visible')

const model = ref({})

const handleSubmit = () => {
  console.log('提交')
  visible.value = false
}
</script>
<template>
  <a-modal v-model:open="visible" title="战败原因" @ok="handleSubmit">
    <a-form
      v-model:model="model"
      class="mt-30px"
      labelAlign="left"
      :labelCol="{ span: 4 }"
    >
      <a-row gutter="10">
        <a-col>
          <a-form-item name="other">
            <a-checkbox v-model:checked="model.other">其他</a-checkbox>
          </a-form-item>
        </a-col>
        <a-col>
          <a-form-item name="reason">
            <a-input placeholder="可备注具体原因" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>
