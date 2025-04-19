<script setup>
import dayjs from 'dayjs'
import { find } from 'lodash-es'
import { computed } from 'vue'

const props = defineProps({
  dates: {
    type: Array,
    default: () => []
  }
})

const model = defineModel()

// 每天可预约的时间段
const dateTimes = computed(() => {
  const { times } = find(props.dates, { id: model.value.dateId }) || {}
  return times || []
})

const handleDate = ({ id }) => {
  model.value = {
    ...model.value,
    timeId: id
  }
}
</script>
<template>
  <div>
    <a-tabs v-model:activeKey="model.dateId">
      <a-tab-pane v-for="{ date, id } in dates" :key="id">
        <template #tab>
          <div>{{ date }}</div>
          <div>{{ dayjs(date).format('dddd') }}</div>
        </template>
      </a-tab-pane>
    </a-tabs>
    <div class="grid grid-cols-5 gap-16px bg-white">
      <div
        v-for="date in dateTimes"
        :key="date.id"
        class="text-center h-40px line-height-40px rounded border border-#ededed border-solid cursor-pointer"
        :class="{
          'bg-#eee pointer-events-none cursor-not-allowed': date.status != 1,
          'bg-blue text-white font-bold': date.id == model.timeId
        }"
        @click="handleDate(date)"
      >
        {{ date.startTimeStr }}
      </div>
    </div>
  </div>
</template>

<style lang="less">
.ant-tabs-tab-btn {
  text-align: center;
}
</style>
