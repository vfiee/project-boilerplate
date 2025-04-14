<script setup>
import { updateDialogTitle } from '@/utils'
import { onMounted } from 'vue'
import AfterSalesContent from './components/afterSalesContent.vue'
import AfterSalesTask from './components/afterSalesTask.vue'
import CarInfo from './components/carInfo.vue'
import { useCarStore } from './stores'

updateDialogTitle('人工坐席招揽任务详情')
const carStore = useCarStore()

onMounted(() => {
  carStore.getCarDetail()
})
</script>
<template>
  <div class="size-full bg-[#e6e9f0] p-10px flex">
    <CarInfo />
    <div class="flex-1 ml-10px h-full overflow-y-auto">
      <AfterSalesTask />
      <AfterSalesContent />
    </div>
  </div>
</template>
