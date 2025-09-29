<script setup>
import { message } from 'ant-design-vue'
import { findIndex } from 'lodash-es'
import { ref } from 'vue'
import { getEnvs, useEnvStore } from './store'

defineOptions({
  name: 'PickerEnv'
})

const props = defineProps({
  envs: {
    type: Array,
    default: () => []
  }
})

const envStore = useEnvStore(getEnvs(props.envs))
const selectedEnv = ref(envStore.currentEnv.value?.env)
const columnsFieldNames = { label: 'name', value: 'env' }

const onConfirm = () => {
  const index = findIndex(envStore.envs.value, { env: selectedEnv.value })
  envStore.setCurrentEnvByIndex(index)
  envStore.hide()
  message.success(`已切换到 ${envStore.currentEnv.value.name}`)
}

const onEnvChange = (envName) => {
  selectedEnv.value = envName
}
</script>
<template>
  <a-modal
    v-model:open="envStore.visible.value"
    title="切换环境"
    centered
    destroyOnClose
    class="w-1/3"
    ok-text="确认"
    cancel-text="取消"
    @ok="onConfirm"
    @cancel="envStore.hide"
  >
    <a-select
      class="w-full py-20px"
      :value="selectedEnv"
      placeholder="请选择要切换的环境"
      :options="envStore.mapColumns"
      :fieldNames="columnsFieldNames"
      @change="onEnvChange"
    ></a-select>
  </a-modal>
</template>
