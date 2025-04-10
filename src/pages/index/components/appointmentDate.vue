<script setup>
import dayjs from 'dayjs'
import { find, random } from 'lodash-es'
import { ref, computed, nextTick } from 'vue'

const maxDAYNumber = 30
const currentDate = ref(dayjs())
// 可操作的日期范围
const dateRange = computed(() => {
  return Array.from(Array(maxDAYNumber)).map((_, index) => {
    const date = currentDate.value.add(index, 'day')
    return {
      date,
      text: date.format('MM-DD'),
      weekText: date.format('dddd')
    }
  })
})
// 每天可预约的时间段
const dateTimes = Array.from(Array(20)).map((_, index) => {
  return {
    id: index,
    text: `${index + 1}:00`,
    disabled: random(0, 10) > 5
  }
})

// {
//   date // 当前选择的日期,dayjs
//   timeText // 当前选择的时间段
//   timeId // 当前选择的时间段ID
// }
const value = defineModel()
const activeTab = ref()
const activeTimeId = ref()

const activeDate = computed(() =>
  find(dateRange.value, { text: activeTab.value })
)

const activeTime = computed(() => find(dateTimes, { id: activeTimeId.value }))

const handleDate = ({ id }) => {
  activeTimeId.value = id
  value.value = {
    date: activeDate.value.date,
    timeText: activeTime.value?.text,
    timeId: activeTime.value?.id
  }
}

const initState = () => {
  // 初始化当前选中的tab标签
  if (value.value?.date) {
    activeTab.value = value.value.date?.format('MM-DD')
  } else {
    activeTab.value = dayjs().format('MM-DD')
  }

  if (value.value?.timeId) {
    activeTimeId.value = value.value.timeId
  }
}

initState()
</script>
<template>
  <div>
    <a-tabs v-model:activeKey="activeTab">
      <a-tab-pane v-for="{ text, weekText } in dateRange" :key="text">
        <template #tab>
          <div>{{ text }}</div>
          <div>{{ weekText }}</div>
        </template>
      </a-tab-pane>
    </a-tabs>
    <div class="grid grid-cols-5 gap-16px bg-white">
      <div
        v-for="date in dateTimes"
        :key="date.text"
        class="text-center h-40px line-height-40px rounded border border-#ededed border-solid cursor-pointer"
        :class="{
          'bg-#eee pointer-events-none cursor-not-allowed': date.disabled,
          'bg-blue text-white font-bold': date.id === activeTimeId
        }"
        @click="handleDate(date)"
      >
        {{ date.text }}
      </div>
    </div>
  </div>
</template>
