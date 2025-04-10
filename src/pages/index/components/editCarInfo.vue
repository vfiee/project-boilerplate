<script setup>
import { ref } from 'vue'
import { merge } from 'lodash-es'

defineOptions({ name: 'EditCarInfo' })

const props = defineProps({
  data: {
    type: Object
  }
})

const visible = defineModel('visible')

const model = ref()

function initModel() {
  const { ownerName, ownerTel, userName, userTel, id } = props.data
  model.value = merge({}, model.value, {
    id,
    ownerName,
    ownerTel,
    userName,
    userTel
  })
}

function init() {
  initModel()
}

init()
</script>
<template>
  <a-modal v-model:open="visible" title="修改人车关系">
    <a-form v-model:model="model" class="mt-30px">
      <a-form-item label="所有人姓名" placeholder="请输入姓名">
        <a-input v-model:value="model.ownerName" placeholder="请输入姓名" />
      </a-form-item>
      <a-form-item label="所有人电话">
        <a-input
          v-model:value="model.ownerTel"
          type="tel"
          placeholder="请输入手机号"
        />
      </a-form-item>
      <a-form-item label="使用者姓名">
        <a-input v-model:value="model.userName" placeholder="请输入姓名" />
      </a-form-item>
      <a-form-item label="使用者电话">
        <a-input
          v-model:value="model.userTel"
          type="tel"
          placeholder="请输入手机号"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
