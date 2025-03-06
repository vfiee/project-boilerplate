<script setup>
import { useBoolean } from '@/hooks'
import { ref } from 'vue'

const props = defineProps({
  url: {
    type: String,
    required: true
  },
  width: {
    type: String,
    default: ''
  },
  height: {
    type: String,
    default: ''
  },
  containerClass: {
    type: String,
    default: ''
  },
  iframeClass: {
    type: String,
    default: ''
  }
})

const iframe = ref()
const { bool, setFalse, setTrue } = useBoolean(true)

const refresh = () => {
  setFalse()
  setTimeout(() => {
    setTrue()
  }, 50)
}

defineExpose({
  iframe,
  refresh
})
</script>

<template>
  <n-spin
    class="size-full"
    :width="width"
    :height="height"
    :class="containerClass"
    content-class="size-full"
  >
    <iframe
      v-if="bool"
      ref="iframe"
      :src="url"
      class="size-full"
      :class="iframeClass"
    />
  </n-spin>
</template>
