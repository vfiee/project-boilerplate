<script setup>
import NetworkError from '@/assets/svgs/network-error.svg'
import NoPermission from '@/assets/svgs/no-permission.svg'
import ServiceError from '@/assets/svgs/service-error.svg'
import router from '@/router'
import { computed } from 'vue'

defineOptions({ name: 'ExceptionBase' })

const props = defineProps({
  type: {
    type: String,
    default: '404',
    validator: (value) => ['403', '404', '500'].includes(value)
  }
})

const iconMap = {
  403: NoPermission,
  404: NetworkError,
  500: ServiceError
}

const icon = computed(() => iconMap[props.type])

const toHome = () => {
  router.replace({ path: '/' })
}
</script>

<template>
  <div class="size-full min-h-520px flex-col-center gap-24px overflow-hidden">
    <div class="flex">
      <img class="w-500px" :src="icon" />
    </div>
    <AButton type="primary" @click="toHome">返回首页</AButton>
  </div>
</template>
