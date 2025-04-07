<script setup>
import { useBoolean } from '@/hooks'
import AfterSalesContent from './components/afterSalesContent.vue'
import AfterSalesTask from './components/afterSalesTask.vue'
import CarInfo from './components/carInfo.vue'

const { bool } = useBoolean(false)
</script>
<template>
  <div class="size-full bg-[#e6e9f0] p-10px flex">
    <CarInfo />
    <div class="flex-1 ml-10px flex-col">
      <AfterSalesTask v-model:visible="bool" />
      <AfterSalesContent v-model:hide="bool" />
    </div>
  </div>
</template>
