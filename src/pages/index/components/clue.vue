<script setup>
// 定保线索
import { useAxios } from '@/services'
import { getUrlParams } from '@/utils'
import { get, isFunction, toNumber } from 'lodash-es'
import { computed } from 'vue'

defineOptions({ name: 'Clue' })

const { recordId } = getUrlParams()
const { data, execute } = useAxios(
  '/rest/data/v2.0/scripts/api/pageapi/leadinfo',
  {
    method: 'get',
    params: { id: recordId }
  }
)

const progress = computed(() => {
  const { dates, alldate } = data.value || {}
  const progressValue = toNumber(dates) / toNumber(alldate)
  return isNaN(progressValue) ? 0 : progressValue * 100
})

const progressText = () => `${get(data.value, 'dates', 0)}天`

const dingBaoInfoList = [
  { label: '上次进店', value: 'last_date' },
  { label: '下次保养', value: 'next_date' },
  {
    label: '进店里程',
    value: (data) => {
      const mileage = get(data, 'in_mileage')
      return mileage ? `${mileage}km` : '-'
    }
  },
  {
    label: '预估里程',
    value: (data) => {
      const mileage = get(data, 'expect_mileage')
      return mileage ? `${mileage}km` : '-'
    }
  }
]

execute()
</script>
<template>
  <div class="flex-1 px-30px">
    <!-- 定保图表 -->
    <div class="flex">
      <a-progress
        class="size-120px"
        type="circle"
        :stroke-color="{
          '0%': '#108ee9',
          '100%': '#87d068'
        }"
        :percent="progress"
        :format="progressText"
      />
      <div class="ml-16px flex-1">
        <div class="text-17px font-500">{{ get(data, 'leadname', '') }}</div>
        <div class="flex-y-center w-full">
          机油机滤
          <div class="flex-1 h-10px rounded bg-#999 mx-10px"></div>
          {{ get(data, 'next_date', '') }}
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
        <span class="ml-6px">{{
          isFunction(value) ? value(data) : get(data, value, '-')
        }}</span>
      </div>
    </div>
  </div>
</template>
