<script setup>
import { updateDialogTitle } from '@/utils'
import AfterSalesContent from './components/afterSalesContent.vue'
import AfterSalesTask from './components/afterSalesTask.vue'
import CarInfo from './components/carInfo.vue'

updateDialogTitle('人工坐席招揽任务详情')
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
