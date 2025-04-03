<script setup>
// 定保线索
import Echart from './echart.vue';

defineOptions({ name: 'Clue' })

const dingBaoInfoList = [
  { label: '上次进店', value: '2024/03/01' },
  { label: '下次保养', value: '2024/03/01' },
  { label: '进店里程', value: '13337km' },
  { label: '预估里程', value: '17729km' }
]
</script>
<template>
  <div class="flex-1 px-30px">
    <!-- 定保图表 -->
    <div class="flex">
      <!-- <div class="size-100px rounded-full bg-blue"></div> -->
      <Echart class="size-100px" />
      <div class="ml-16px flex-1">
        <div class="text-17px font-500">3月定保线索</div>
        <div class="flex-y-center w-full">
          机油机滤
          <div class="flex-1 h-10px rounded bg-#999 mx-10px"></div>
          2025/03/01
        </div>
      </div>
    </div>
    <!-- 定保信息 -->
    <div class="grid grid-cols-2 mt-30px gap-row-8px">
      <div
        v-for="({ label, value }, index) in dingBaoInfoList"
        :key="'dingbao' + index"
      >
        {{ label }}
        <span class="ml-6px">{{ value }}</span>
      </div>
    </div>
  </div>
</template>
