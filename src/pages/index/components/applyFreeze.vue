<script setup>
import { ref } from 'vue'
import { Icon } from '@iconify/vue'

defineOptions({ name: 'ApplyFreeze' })

const visible = defineModel('visible')

const model = ref({})

const handleSubmit = () => {
  console.log('提交')
  visible.value = false
}
</script>
<template>
  <a-modal v-model:open="visible" title="申请冻结" @ok="handleSubmit">
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
        <a-checkbox v-model:checked="model.other2">客户拒绝打扰</a-checkbox>
      </a-form-item>
      <a-row gutter="10">
        <a-col>
          <a-form-item name="other">
            <a-checkbox v-model:checked="model.other">其他</a-checkbox>
          </a-form-item></a-col
        >
        <a-col>
          <a-form-item name="reason">
            <a-input :disabled="!model.other" placeholder="可备注具体原因" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>
